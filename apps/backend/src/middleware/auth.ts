import { Context, Next } from 'hono';
import { verify } from 'hono/jwt';
import { Env } from '../types/env';

export type JwtPayload = {
  id: string;
  email: string;
  role: 'SHIPPER' | 'BROKER' | 'CARRIER' | 'ADMIN';
  status: string;
  exp: number;
};

// Extend Context to include user
declare module 'hono' {
  interface ContextVariableMap {
    user: JwtPayload;
  }
}

export const authMiddleware = async (c: Context<{ Bindings: Env }>, next: Next) => {
  const authHeader = c.req.header('Authorization');
  const queryToken = c.req.query('token');
  
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (queryToken) {
    token = queryToken;
  }

  if (!token) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token' } }, 401);
  }
  try {
    const secret = c.env.JWT_SECRET || 'fallback-secret-do-not-use-in-prod';
    const payload = await verify(token, secret, 'HS256') as unknown as JwtPayload;
    
    // Check if token is expired
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Token expired' } }, 401);
    }

    c.set('user', payload);
    await next();
  } catch (error) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid token' } }, 401);
  }
};

export const requireRole = (roles: ('SHIPPER' | 'BROKER' | 'CARRIER' | 'ADMIN')[]) => {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    const user = c.get('user');
    if (!user) {
      return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, 401);
    }

    if (!roles.includes(user.role)) {
      return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } }, 403);
    }

    await next();
  };
};

export const requireVerified = async (c: Context<{ Bindings: Env }>, next: Next) => {
  const user = c.get('user');
  
  if (!user) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, 401);
  }

  // Fetch current user status from DB to ensure it's up to date
  const dbUser = await c.env.DB.prepare('SELECT status FROM users WHERE id = ?').bind(user.id).first<{ status: string }>();
  
  if (!dbUser) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'User not found' } }, 401);
  }

  if (dbUser.status !== 'ACTIVE') {
    return c.json({ 
      success: false, 
      error: { 
        code: 'FORBIDDEN', 
        message: 'Account must be verified and active to perform this action' 
      } 
    }, 403);
  }

  await next();
};
