import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { Env } from '../types/env';
import { CryptoService } from '../services/crypto';
import { registerSchema, loginSchema } from '../validators/auth';
import { authMiddleware, JwtPayload } from '../middleware/auth';

const router = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

router.post('/register', async (c) => {
  const body = await c.req.json();
  
  const parseResult = registerSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json({ 
      success: false, 
      error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: parseResult.error.errors } 
    }, 400);
  }

  const data = parseResult.data;

  // Check if email exists
  const existingUser = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?')
    .bind(data.email.toLowerCase())
    .first();

  if (existingUser) {
    return c.json({ success: false, error: { code: 'CONFLICT', message: 'Email already exists' } }, 409);
  }

  const passwordHash = await CryptoService.hashPassword(data.password);
  
  // Create user and profile in a transaction (simulated with batch)
  const userId = crypto.randomUUID().replace(/-/g, '').toLowerCase();
  const profileId = crypto.randomUUID().replace(/-/g, '').toLowerCase();
  
  const status = data.role === 'SHIPPER' || data.role === 'CARRIER' ? 'PENDING_VERIFICATION' : 'ACTIVE';
  
  const userStmt = c.env.DB.prepare(`
    INSERT INTO users (id, email, password_hash, role, status)
    VALUES (?, ?, ?, ?, ?)
  `).bind(userId, data.email.toLowerCase(), passwordHash, data.role, status);

  const profileStmt = c.env.DB.prepare(`
    INSERT INTO profiles (id, user_id, first_name, last_name, company_name, phone, dot_number, mc_number, equipment_types, operating_regions, address, city, state, zip, country, verification_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    profileId, 
    userId, 
    data.firstName, 
    data.lastName, 
    data.companyName, 
    data.phone,
    data.dotNumber || null,
    data.mcNumber || null,
    data.equipmentTypes ? JSON.stringify(data.equipmentTypes) : null,
    data.operatingRegions ? JSON.stringify(data.operatingRegions) : null,
    data.address || null,
    data.city || null,
    data.state || null,
    data.zip || null,
    data.country
  );

  const auditStmt = c.env.DB.prepare(`
    INSERT INTO audit_logs (id, actor_id, actor_role, action, entity_type, entity_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(crypto.randomUUID().replace(/-/g, '').toLowerCase(), userId, data.role, 'USER_REGISTERED', 'USER', userId);

  try {
    await c.env.DB.batch([userStmt, profileStmt, auditStmt]);
    
    // Generate JWT
    const payload: JwtPayload = {
      id: userId,
      email: data.email.toLowerCase(),
      role: data.role as any,
      status,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
    };
    
    const token = await sign(payload, c.env.JWT_SECRET || 'fallback-secret-do-not-use-in-prod');
    
    return c.json({
      success: true,
      data: {
        token,
        user: { id: userId, email: data.email.toLowerCase(), role: data.role, status }
      }
    }, 201);
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create user' } }, 500);
  }
});

router.post('/login', async (c) => {
  const body = await c.req.json();
  
  const parseResult = loginSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json({ 
      success: false, 
      error: { code: 'VALIDATION_ERROR', message: 'Invalid credentials' } 
    }, 400);
  }

  const { email, password } = parseResult.data;

  const user = await c.env.DB.prepare('SELECT id, email, password_hash, role, status, COALESCE(onboarding_paid, 0) as onboarding_paid FROM users WHERE email = ?')
    .bind(email.toLowerCase())
    .first<{ id: string, email: string, password_hash: string, role: string, status: string, onboarding_paid: number }>();

  if (!user) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } }, 401);
  }

  const isValid = await CryptoService.verifyPassword(password, user.password_hash);
  
  if (!isValid) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } }, 401);
  }

  if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
    return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'Account is suspended' } }, 403);
  }

  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role as any,
    status: user.status,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
  };
  
  const token = await sign(payload, c.env.JWT_SECRET || 'fallback-secret-do-not-use-in-prod');
  
  // Log login
  await c.env.DB.prepare(`
    INSERT INTO audit_logs (id, actor_id, actor_role, action, entity_type, entity_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(crypto.randomUUID().replace(/-/g, '').toLowerCase(), user.id, user.role, 'USER_LOGIN', 'USER', user.id).run();

  return c.json({
    success: true,
    data: {
      token,
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        status: user.status,
        onboarding_paid: Number(user.onboarding_paid || 0)
      }
    }
  });
});

router.post('/admin-login', async (c) => {
  const body = await c.req.json();
  
  const parseResult = loginSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json({ 
      success: false, 
      error: { code: 'VALIDATION_ERROR', message: 'Invalid credentials' } 
    }, 400);
  }

  const { email, password } = parseResult.data;

  const user = await c.env.DB.prepare('SELECT id, email, password_hash, role, status FROM users WHERE email = ?')
    .bind(email.toLowerCase())
    .first<{ id: string, email: string, password_hash: string, role: string, status: string }>();

  if (!user) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } }, 401);
  }

  const isValid = await CryptoService.verifyPassword(password, user.password_hash);
  
  if (!isValid) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } }, 401);
  }

  if (user.role !== 'ADMIN') {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } }, 401);
  }

  if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
    return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'Account is suspended' } }, 403);
  }

  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role as any,
    status: user.status,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
  };
  
  const token = await sign(payload, c.env.JWT_SECRET || 'fallback-secret-do-not-use-in-prod');
  
  // Log login
  await c.env.DB.prepare(`
    INSERT INTO audit_logs (id, actor_id, actor_role, action, entity_type, entity_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(crypto.randomUUID().replace(/-/g, '').toLowerCase(), user.id, user.role, 'ADMIN_LOGIN', 'USER', user.id).run();

  return c.json({
    success: true,
    data: {
      token,
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        status: user.status,
        onboarding_paid: 1
      }
    }
  });
});

router.post('/google', async (c) => {
  const body = await c.req.json();
  const token = body.token;
  if (!token) return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Missing token' } }, 400);

  // Fetch Google user profile
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!response.ok) {
      return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid Google token' } }, 401);
    }

    const googleUser = await response.json() as any;
    const { sub: googleId, email, name } = googleUser;

    // Check if user exists by email or google_id
    const user = await c.env.DB.prepare('SELECT id, email, password_hash, role, status FROM users WHERE email = ? OR google_id = ?')
      .bind(email.toLowerCase(), googleId)
      .first<{ id: string, email: string, password_hash: string, role: string, status: string }>();

    if (user) {
      if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
        return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'Account is suspended' } }, 403);
      }

      // Update google_id if it's not set
      await c.env.DB.prepare('UPDATE users SET google_id = ?, auth_provider = ? WHERE id = ?')
        .bind(googleId, 'google', user.id).run();

      const payload: JwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role as any,
        status: user.status,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      };
      
      const jwtToken = await sign(payload, c.env.JWT_SECRET || 'fallback-secret-do-not-use-in-prod');
      
      await c.env.DB.prepare(`
        INSERT INTO audit_logs (id, actor_id, actor_role, action, entity_type, entity_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(crypto.randomUUID().replace(/-/g, '').toLowerCase(), user.id, user.role, 'USER_LOGIN_GOOGLE', 'USER', user.id).run();

      return c.json({
        success: true,
        data: {
          token: jwtToken,
          user: { id: user.id, email: user.email, role: user.role, status: user.status }
        }
      });
    } else {
      return c.json({
        success: true,
        data: {
          status: 'PROFILE_INCOMPLETE',
          email: email.toLowerCase(),
          googleId,
          name,
          googleToken: token
        }
      });
    }
  } catch (error) {
    console.error('Google auth error:', error);
    return c.json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Google Auth Failed' } }, 500);
  }
});

router.post('/google-complete', async (c) => {
  const body = await c.req.json();
  const { email, googleId, googleToken, role, firstName, lastName, companyName, phone, dotNumber, mcNumber } = body;
  
  if (!email || !googleId) {
    return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Missing google info' } }, 400);
  }

  const userId = crypto.randomUUID().replace(/-/g, '').toLowerCase();
  const profileId = crypto.randomUUID().replace(/-/g, '').toLowerCase();
  const status = role === 'SHIPPER' || role === 'CARRIER' ? 'PENDING_VERIFICATION' : 'ACTIVE';
  
  const userStmt = c.env.DB.prepare(`
    INSERT INTO users (id, email, password_hash, auth_provider, google_id, role, status, email_verified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(userId, email.toLowerCase(), '', 'google', googleId, role, status, 1);

  const profileStmt = c.env.DB.prepare(`
    INSERT INTO profiles (id, user_id, first_name, last_name, company_name, phone, dot_number, mc_number, verification_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(profileId, userId, firstName, lastName, companyName, phone, dotNumber || null, mcNumber || null, 'PENDING');

  const auditStmt = c.env.DB.prepare(`
    INSERT INTO audit_logs (id, actor_id, actor_role, action, entity_type, entity_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(crypto.randomUUID().replace(/-/g, '').toLowerCase(), userId, role, 'USER_REGISTERED_GOOGLE', 'USER', userId);

  try {
    await c.env.DB.batch([userStmt, profileStmt, auditStmt]);
    
    const payload: JwtPayload = {
      id: userId,
      email: email.toLowerCase(),
      role: role as any,
      status,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    };
    
    const token = await sign(payload, c.env.JWT_SECRET || 'fallback-secret-do-not-use-in-prod');
    
    return c.json({
      success: true,
      data: {
        token,
        user: { id: userId, email: email.toLowerCase(), role, status }
      }
    }, 201);
  } catch (error) {
    console.error('Google registration complete error:', error);
    return c.json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create user' } }, 500);
  }
});

router.post('/logout', authMiddleware, async (c) => {
  // Since we are using stateless JWT, we can't truly invalidate it server-side without a denylist.
  // We'll just return success and let the client delete the token.
  return c.json({ success: true, data: { message: 'Logged out successfully' } });
});

router.get('/me', authMiddleware, async (c) => {
  const user = c.get('user');
  
  // Fetch fresh user data
  const dbUser = (await c.env.DB.prepare('SELECT * FROM users WHERE id = ?')
    .bind(user.id)
    .first()) as any;
    
  if (!dbUser) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } }, 404);
  }
  
  const profile = (await c.env.DB.prepare('SELECT first_name, last_name, company_name, verification_status, verification_notes as rejection_reason FROM profiles WHERE user_id = ?')
    .bind(user.id)
    .first()) as { first_name: string, last_name: string, company_name: string, verification_status: string, rejection_reason: string } | null;

  const docCount = (await c.env.DB.prepare('SELECT COUNT(*) as c FROM documents WHERE user_id = ?')
    .bind(user.id)
    .first()) as { c: number } | null;

  const vStatus = profile?.verification_status || 'PENDING';
  const docsUploaded = Number(docCount?.c || 0) > 0;

  return c.json({ 
    success: true, 
    data: { 
      user: {
        id: dbUser.id,
        email: dbUser.email,
        role: dbUser.role,
        status: dbUser.status,
        onboarding_paid: Number(dbUser.onboarding_paid || 0),
        verification_status: vStatus,
        documents_uploaded: docsUploaded
      },
      profile
    } 
  });
});

export default router;
