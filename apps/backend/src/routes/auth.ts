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
      user: { id: user.id, email: user.email, role: user.role, status: user.status }
    }
  });
});

router.post('/logout', authMiddleware, async (c) => {
  // Since we are using stateless JWT, we can't truly invalidate it server-side without a denylist.
  // We'll just return success and let the client delete the token.
  return c.json({ success: true, data: { message: 'Logged out successfully' } });
});

router.get('/me', authMiddleware, async (c) => {
  const user = c.get('user');
  
  // Fetch fresh user data
  const dbUser = await c.env.DB.prepare('SELECT id, email, role, status FROM users WHERE id = ?')
    .bind(user.id)
    .first<{ id: string, email: string, role: string, status: string }>();
    
  if (!dbUser) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } }, 404);
  }
  
  const profile = await c.env.DB.prepare('SELECT first_name, last_name, company_name, verification_status FROM profiles WHERE user_id = ?')
    .bind(user.id)
    .first<{ first_name: string, last_name: string, company_name: string, verification_status: string }>();

  return c.json({ 
    success: true, 
    data: { 
      user: dbUser,
      profile
    } 
  });
});

export default router;
