import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { Env } from '../types/env';
import { CryptoService } from '../services/crypto';
import { SettingsService } from '../services/settings';
import { registerSchema, loginSchema } from '../validators/auth';
import { authMiddleware, JwtPayload } from '../middleware/auth';

const router = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

router.post('/register', async (c) => {
  const body = await c.req.json();
  
  // 1. Terms & Conditions acceptance verification
  const termsAccepted = Boolean(body.termsAccepted || body.terms_accepted || body.terms);
  if (!termsAccepted) {
    return c.json({ 
      success: false, 
      error: 'TERMS_REQUIRED',
      code: 'TERMS_REQUIRED',
      message: 'You must agree to the Doxhaul Terms of Service and Privacy Policy to create an account.' 
    }, 400);
  }

  const parseResult = registerSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json({ 
      success: false, 
      error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: parseResult.error.errors } 
    }, 400);
  }

  const data = parseResult.data;
  const rawPhone = data.phone || data.phoneNumber || (body.phone || body.phoneNumber);
  if (rawPhone) {
    const cleaned = rawPhone.replace(/[\s()-]/g, '');
    data.phone = cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
  }

  // Check if email exists
  const existingUser = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?')
    .bind(data.email.toLowerCase())
    .first();

  if (existingUser) {
    return c.json({ success: false, error: { code: 'CONFLICT', message: 'Email already exists' } }, 409);
  }

  const passwordHash = await CryptoService.hashPassword(data.password);
  
  // Dynamic Role Onboarding Fee from live Platform Settings
  const settings = await SettingsService.getPlatformSettings(c.env.DB);
  let fee = 0;
  if (data.role === 'CARRIER') fee = settings.carrier_onboarding_fee;
  else if (data.role === 'BROKER') fee = settings.broker_onboarding_fee;
  else if (data.role === 'SHIPPER') fee = settings.shipper_onboarding_fee;

  const onboardingPaymentStatus = fee > 0 ? 'PENDING_PAYMENT' : 'ACTIVE';
  const onboardingPaid = fee > 0 ? 0 : 1;

  // Create user and profile in a transaction (simulated with batch)
  const userId = crypto.randomUUID().replace(/-/g, '').toLowerCase();
  const profileId = crypto.randomUUID().replace(/-/g, '').toLowerCase();
  
  const status = data.role === 'SHIPPER' || data.role === 'CARRIER' ? 'PENDING_VERIFICATION' : 'ACTIVE';
  
  const userStmt = c.env.DB.prepare(`
    INSERT INTO users (
      id, email, password_hash, role, status, 
      terms_accepted, terms_accepted_at, 
      onboarding_payment_status, onboarding_paid, onboarding_fee_paid
    )
    VALUES (?, ?, ?, ?, ?, 1, datetime('now'), ?, ?, 0)
  `).bind(userId, data.email.toLowerCase(), passwordHash, data.role, status, onboardingPaymentStatus, onboardingPaid);

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
        user: { 
          id: userId, 
          email: data.email.toLowerCase(), 
          role: data.role, 
          status,
          onboarding_payment_status: onboardingPaymentStatus,
          onboarding_paid: onboardingPaid,
          fee
        }
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

  const user = await c.env.DB.prepare(`
    SELECT id, email, password_hash, role, status, 
      COALESCE(onboarding_paid, 0) as onboarding_paid,
      COALESCE(onboarding_payment_status, 'ACTIVE') as onboarding_payment_status
    FROM users 
    WHERE email = ?
  `)
    .bind(email.toLowerCase())
    .first<{ 
      id: string, 
      email: string, 
      password_hash: string, 
      role: string, 
      status: string, 
      onboarding_paid: number,
      onboarding_payment_status: string 
    }>();

  // 1. Unregistered user check: Return 404 USER_NOT_REGISTERED
  if (!user) {
    return c.json({ 
      success: false, 
      error: 'USER_NOT_REGISTERED', 
      code: 'USER_NOT_REGISTERED', 
      message: 'No account found with this email.' 
    }, 404);
  }

  const isValid = await CryptoService.verifyPassword(password, user.password_hash);
  
  if (!isValid) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } }, 401);
  }

  if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
    return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'Account is suspended' } }, 403);
  }

  // 2. Role Onboarding Fee Gate / Payment Lockout check
  if (user.onboarding_payment_status === 'PENDING_PAYMENT') {
    const settings = await SettingsService.getPlatformSettings(c.env.DB);
    let fee = 0;
    if (user.role === 'CARRIER') fee = settings.carrier_onboarding_fee;
    else if (user.role === 'BROKER') fee = settings.broker_onboarding_fee;
    else if (user.role === 'SHIPPER') fee = settings.shipper_onboarding_fee;

    return c.json({
      success: false,
      error: 'PAYMENT_REQUIRED',
      code: 'PAYMENT_REQUIRED',
      message: `Your ${user.role} registration is pending activation. Please complete the $${fee} onboarding fee to unlock your credentials.`,
      fee,
      role: user.role,
      email: user.email
    }, 403);
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
        onboarding_payment_status: user.onboarding_payment_status,
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
        onboarding_paid: 1,
        onboarding_payment_status: 'ACTIVE'
      }
    }
  });
});

router.post('/google', async (c) => {
  try {
    const body = await c.req.json();
    const token = body.token || body.access_token || body.credential;
    if (!token) {
      return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'No Google token provided' } }, 400);
    }

    let googleUser: { sub: string; email: string; name?: string; picture?: string } | null = null;

    // 1. Try verifying as OAuth access_token via userinfo endpoint
    try {
      const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (userinfoRes.ok) {
        googleUser = await userinfoRes.json() as any;
      }
    } catch (e) {
      // Fall through to id_token check
    }

    // 2. If access_token check failed, try verifying as JWT ID token
    if (!googleUser) {
      try {
        const tokenInfoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
        if (tokenInfoRes.ok) {
          googleUser = await tokenInfoRes.json() as any;
        }
      } catch (e) {
        // Fall through
      }
    }

    if (!googleUser || !googleUser.email) {
      return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid or expired Google token' } }, 401);
    }

    const { sub: googleId, email, name } = googleUser;

    // 3. User Lookup & Registration logic
    const db = c.env.DB;
    const existingUser = await db.prepare(`
      SELECT id, email, password_hash, role, status,
        COALESCE(onboarding_paid, 0) as onboarding_paid,
        COALESCE(onboarding_payment_status, 'ACTIVE') as onboarding_payment_status
      FROM users 
      WHERE email = ? OR google_id = ?
    `)
      .bind(email.toLowerCase(), googleId)
      .first<{ 
        id: string, 
        email: string, 
        password_hash: string, 
        role: string, 
        status: string,
        onboarding_paid: number,
        onboarding_payment_status: string 
      }>();

    if (existingUser) {
      if (existingUser.status === 'BANNED' || existingUser.status === 'SUSPENDED') {
        return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'Account is suspended' } }, 403);
      }

      // Check onboarding payment lockout for existing Google user
      if (existingUser.onboarding_payment_status === 'PENDING_PAYMENT') {
        const settings = await SettingsService.getPlatformSettings(c.env.DB);
        let fee = 0;
        if (existingUser.role === 'CARRIER') fee = settings.carrier_onboarding_fee;
        else if (existingUser.role === 'BROKER') fee = settings.broker_onboarding_fee;
        else if (existingUser.role === 'SHIPPER') fee = settings.shipper_onboarding_fee;

        return c.json({
          success: false,
          error: 'PAYMENT_REQUIRED',
          code: 'PAYMENT_REQUIRED',
          message: `Your ${existingUser.role} registration is pending activation. Please complete the $${fee} onboarding fee to unlock your credentials.`,
          fee,
          role: existingUser.role,
          email: existingUser.email
        }, 403);
      }

      // Update google_id if it's not set
      await c.env.DB.prepare('UPDATE users SET google_id = ?, auth_provider = ? WHERE id = ?')
        .bind(googleId, 'google', existingUser.id).run();

      const payload: JwtPayload = {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role as any,
        status: existingUser.status,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      };
      
      const jwtToken = await sign(payload, c.env.JWT_SECRET || 'fallback-secret-do-not-use-in-prod');
      
      await c.env.DB.prepare(`
        INSERT INTO audit_logs (id, actor_id, actor_role, action, entity_type, entity_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(crypto.randomUUID().replace(/-/g, '').toLowerCase(), existingUser.id, existingUser.role, 'USER_LOGIN_GOOGLE', 'USER', existingUser.id).run();

      return c.json({
        success: true,
        data: {
          token: jwtToken,
          user: { 
            id: existingUser.id, 
            email: existingUser.email, 
            role: existingUser.role, 
            status: existingUser.status,
            onboarding_payment_status: existingUser.onboarding_payment_status,
            onboarding_paid: Number(existingUser.onboarding_paid || 0)
          }
        }
      });
    }

    // 4. New user handling
    if (body.intent === 'register' || body.mode === 'register') {
      return c.json({
        success: true,
        data: {
          status: 'PROFILE_INCOMPLETE',
          email: email.toLowerCase(),
          googleId,
          name: name || '',
          googleToken: token
        }
      });
    }

    // Default for login: Return USER_NOT_REGISTERED (404) so frontend triggers "Account Not Found" modal
    return c.json({
      success: false,
      error: {
        code: 'USER_NOT_REGISTERED',
        message: 'Account not found. Please register first.',
        googleProfile: { email: email.toLowerCase(), name: name || '', sub: googleId }
      }
    }, 404);
  } catch (error: any) {
    console.error('Google auth error:', error);
    return c.json({ success: false, error: { code: 'SERVER_ERROR', message: error.message || 'Google Auth Error' } }, 500);
  }
});

router.post('/google-complete', async (c) => {
  const body = await c.req.json();
  const { email, googleId, googleToken, role, firstName, lastName, companyName, dotNumber, mcNumber } = body;
  const rawPhone = body.phoneNumber || body.phone || '';
  
  // Terms & Conditions verification
  const termsAccepted = Boolean(body.termsAccepted || body.terms_accepted || body.terms);
  if (!termsAccepted) {
    return c.json({ 
      success: false, 
      error: 'TERMS_REQUIRED',
      code: 'TERMS_REQUIRED',
      message: 'You must agree to the Doxhaul Terms of Service and Privacy Policy to complete registration.' 
    }, 400);
  }

  if (!email || !googleId) {
    return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Missing google info' } }, 400);
  }

  let phone = rawPhone;
  if (phone) {
    const cleaned = phone.replace(/[\s()-]/g, '');
    phone = cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
  }

  // Dynamic Role Onboarding Fee from live Platform Settings
  const settings = await SettingsService.getPlatformSettings(c.env.DB);
  let fee = 0;
  if (role === 'CARRIER') fee = settings.carrier_onboarding_fee;
  else if (role === 'BROKER') fee = settings.broker_onboarding_fee;
  else if (role === 'SHIPPER') fee = settings.shipper_onboarding_fee;

  const onboardingPaymentStatus = fee > 0 ? 'PENDING_PAYMENT' : 'ACTIVE';
  const onboardingPaid = fee > 0 ? 0 : 1;

  const userId = crypto.randomUUID().replace(/-/g, '').toLowerCase();
  const profileId = crypto.randomUUID().replace(/-/g, '').toLowerCase();
  const status = role === 'SHIPPER' || role === 'CARRIER' ? 'PENDING_VERIFICATION' : 'ACTIVE';
  
  const userStmt = c.env.DB.prepare(`
    INSERT INTO users (
      id, email, password_hash, auth_provider, google_id, role, status, email_verified,
      terms_accepted, terms_accepted_at, onboarding_payment_status, onboarding_paid, onboarding_fee_paid
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'), ?, ?, 0)
  `).bind(userId, email.toLowerCase(), '', 'google', googleId, role, status, 1, onboardingPaymentStatus, onboardingPaid);

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
        user: { 
          id: userId, 
          email: email.toLowerCase(), 
          role, 
          status,
          onboarding_payment_status: onboardingPaymentStatus,
          onboarding_paid: onboardingPaid,
          fee
        }
      }
    }, 201);
  } catch (error) {
    console.error('Google registration complete error:', error);
    return c.json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create user' } }, 500);
  }
});

router.post('/logout', authMiddleware, async (c) => {
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
        onboarding_payment_status: dbUser.onboarding_payment_status || 'ACTIVE',
        onboarding_paid: Number(dbUser.onboarding_paid || 0),
        onboarding_fee_paid: Number(dbUser.onboarding_fee_paid || 0),
        verification_status: vStatus,
        documents_uploaded: docsUploaded
      },
      profile
    } 
  });
});

export default router;
