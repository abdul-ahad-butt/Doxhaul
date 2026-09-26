import { Hono } from 'hono';
import { Env } from '../types/env';
import { authMiddleware, JwtPayload } from '../middleware/auth';
import { updateProfileSchema } from '../validators/profile';

const router = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

// Apply auth middleware to all profile routes
router.use('*', authMiddleware);

router.get('/', async (c) => {
  const user = c.get('user');
  
  const profile = await c.env.DB.prepare(`
    SELECT p.*, u.email, u.role, u.status 
    FROM profiles p 
    JOIN users u ON p.user_id = u.id 
    WHERE p.user_id = ?
  `).bind(user.id).first();

  if (!profile) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Profile not found' } }, 404);
  }

  // Parse JSON fields
  if (profile.equipment_types && typeof profile.equipment_types === 'string') {
    try { profile.equipment_types = JSON.parse(profile.equipment_types); } catch(e) {}
  }
  if (profile.operating_regions && typeof profile.operating_regions === 'string') {
    try { profile.operating_regions = JSON.parse(profile.operating_regions); } catch(e) {}
  }

  return c.json({ success: true, data: profile });
});

router.put('/', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  
  const parseResult = updateProfileSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json({ 
      success: false, 
      error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: parseResult.error.errors } 
    }, 400);
  }

  const data = parseResult.data;
  
  const updates: string[] = [];
  const values: any[] = [];
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      // Map camelCase to snake_case
      const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      updates.push(`${dbKey} = ?`);
      values.push(Array.isArray(value) ? JSON.stringify(value) : value);
    }
  });

  if (updates.length === 0) {
    return c.json({ success: true, data: { message: 'No changes provided' } });
  }

  values.push(user.id);

  const query = `UPDATE profiles SET ${updates.join(', ')}, updated_at = datetime('now') WHERE user_id = ? RETURNING *`;
  
  const result = await c.env.DB.prepare(query).bind(...values).first();
  
  return c.json({ success: true, data: result });
});

export default router;
