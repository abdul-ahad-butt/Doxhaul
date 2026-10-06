import { Hono } from 'hono';
import { Env } from '../types/env';
import { authMiddleware, JwtPayload } from '../middleware/auth';
import { updateProfileSchema } from '../validators/profile';
import { SettingsService } from '../services/settings';
import { PersonaService } from '../services/persona';

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

// -------------------------------------------------------------
// PERSONA AUTOMATED IDENTITY VERIFICATION INQUIRY
// -------------------------------------------------------------
router.post('/persona-inquiry', async (c) => {
  const user = c.get('user');
  const settings = await SettingsService.getPlatformSettings(c.env.DB);
  
  const inquiry = await PersonaService.createInquiry(settings, {
    userId: user.id,
    email: user.email,
    referenceId: user.id
  });

  return c.json({
    success: true,
    data: inquiry
  });
});

// Sandbox simulation for Persona approval (demo/testing flow)
router.post('/simulate-persona-verify', async (c) => {
  const user = c.get('user');

  await c.env.DB.batch([
    c.env.DB.prepare("UPDATE users SET verification_status = 'APPROVED', status = 'ACTIVE', updated_at = datetime('now') WHERE id = ?").bind(user.id),
    c.env.DB.prepare("UPDATE profiles SET verification_status = 'VERIFIED', updated_at = datetime('now') WHERE user_id = ?").bind(user.id),
    c.env.DB.prepare("UPDATE documents SET status = 'APPROVED', ai_verified = 1, ai_summary = 'Verified via Persona KYC Engine' WHERE user_id = ? AND status = 'PENDING'").bind(user.id),
    c.env.DB.prepare(`
      INSERT INTO audit_logs (id, actor_id, actor_role, action, entity_type, entity_id, metadata)
      VALUES (?, ?, 'USER', 'PERSONA_SIMULATION_APPROVED', 'USER', ?, ?)
    `).bind(
      crypto.randomUUID().replace(/-/g, '').toLowerCase(),
      user.id,
      user.id,
      JSON.stringify({ simulated: true })
    )
  ]);

  return c.json({
    success: true,
    data: {
      message: 'Persona identity verification completed and approved!',
      status: 'VERIFIED'
    }
  });
});

export default router;
