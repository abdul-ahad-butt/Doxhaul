import { Hono } from 'hono';
import { Env } from '../types/env';
import { authMiddleware, JwtPayload, requireRole } from '../middleware/auth';

const router = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

router.use('*', authMiddleware, requireRole(['ADMIN']));

router.get('/metrics', async (c) => {
  const [
    usersCount, 
    pendingVerifications,
    activeLoads,
    totalBookings
  ] = await c.env.DB.batch([
    c.env.DB.prepare('SELECT COUNT(*) as c FROM users'),
    c.env.DB.prepare("SELECT COUNT(*) as c FROM users WHERE status = 'PENDING_VERIFICATION'"),
    c.env.DB.prepare("SELECT COUNT(*) as c FROM loads WHERE is_deleted = 0 AND status != 'DELIVERED' AND status != 'CANCELLED'"),
    c.env.DB.prepare('SELECT COUNT(*) as c FROM bookings')
  ]);

  // @ts-ignore - D1 batch returns results in order
  const getCount = (res) => (res.results && res.results.length > 0 ? res.results[0].c : 0);

  return c.json({
    success: true,
    data: {
      totalUsers: getCount(usersCount),
      pendingVerifications: getCount(pendingVerifications),
      activeLoads: getCount(activeLoads),
      totalBookings: getCount(totalBookings)
    }
  });
});

router.get('/users', async (c) => {
  const users = await c.env.DB.prepare(`
    SELECT u.id, u.email, u.role, u.status, u.created_at, p.first_name, p.last_name, p.company_name
    FROM users u
    LEFT JOIN profiles p ON u.id = p.user_id
    ORDER BY u.created_at DESC
  `).all();

  return c.json({ success: true, data: users.results });
});

router.get('/verifications', async (c) => {
  const verifications = await c.env.DB.prepare(`
    SELECT u.id, u.email, u.role, u.status, p.first_name, p.last_name, p.company_name, p.verification_status, p.updated_at
    FROM users u
    JOIN profiles p ON u.id = p.user_id
    WHERE u.status = 'PENDING_VERIFICATION' OR p.verification_status = 'PENDING'
    ORDER BY p.updated_at ASC
  `).all();

  return c.json({ success: true, data: verifications.results });
});

router.get('/verifications/:id', async (c) => {
  const userId = c.req.param('id');

  const user = await c.env.DB.prepare(`
    SELECT u.id, u.email, u.role, u.status, p.*
    FROM users u
    JOIN profiles p ON u.id = p.user_id
    WHERE u.id = ?
  `).bind(userId).first();

  if (!user) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } }, 404);
  }

  const documents = await c.env.DB.prepare('SELECT * FROM documents WHERE user_id = ?').bind(userId).all();

  return c.json({ success: true, data: { user, documents: documents.results } });
});

router.post('/verifications/:id/approve', async (c) => {
  const userId = c.req.param('id');
  const adminUser = c.get('user');

  const userStmt = c.env.DB.prepare("UPDATE users SET status = 'ACTIVE', updated_at = datetime('now') WHERE id = ?").bind(userId);
  const profileStmt = c.env.DB.prepare("UPDATE profiles SET verification_status = 'VERIFIED', updated_at = datetime('now') WHERE user_id = ?").bind(userId);
  const docsStmt = c.env.DB.prepare("UPDATE documents SET status = 'APPROVED', reviewed_by = ?, reviewed_at = datetime('now') WHERE user_id = ? AND status = 'PENDING'").bind(adminUser.id, userId);
  const auditStmt = c.env.DB.prepare(`INSERT INTO audit_logs (id, actor_id, actor_role, action, entity_type, entity_id) VALUES (?, ?, ?, ?, ?, ?)`).bind(crypto.randomUUID().replace(/-/g, ''), adminUser.id, 'ADMIN', 'USER_VERIFIED', 'USER', userId);

  try {
    await c.env.DB.batch([userStmt, profileStmt, docsStmt, auditStmt]);
    return c.json({ success: true, data: { message: 'User verified successfully' } });
  } catch (error) {
    return c.json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to approve verification' } }, 500);
  }
});

router.post('/verifications/:id/reject', async (c) => {
  const userId = c.req.param('id');
  const adminUser = c.get('user');
  const body = await c.req.json();
  const reason = body.reason || 'Verification rejected by administrator';

  const userStmt = c.env.DB.prepare("UPDATE users SET status = 'ACTIVE', updated_at = datetime('now') WHERE id = ?").bind(userId);
  const profileStmt = c.env.DB.prepare("UPDATE profiles SET verification_status = 'REJECTED', verification_notes = ?, updated_at = datetime('now') WHERE user_id = ?").bind(reason, userId);
  const auditStmt = c.env.DB.prepare(`INSERT INTO audit_logs (id, actor_id, actor_role, action, entity_type, entity_id, metadata) VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(crypto.randomUUID().replace(/-/g, ''), adminUser.id, 'ADMIN', 'USER_REJECTED', 'USER', userId, JSON.stringify({ reason }));

  try {
    await c.env.DB.batch([userStmt, profileStmt, auditStmt]);
    return c.json({ success: true, data: { message: 'User verification rejected' } });
  } catch (error) {
    return c.json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to reject verification' } }, 500);
  }
});

router.post('/users/:id/suspend', async (c) => {
  const userId = c.req.param('id');
  const adminUser = c.get('user');

  if (userId === adminUser.id) {
    return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Cannot suspend yourself' } }, 400);
  }

  const userStmt = c.env.DB.prepare("UPDATE users SET status = 'SUSPENDED', updated_at = datetime('now') WHERE id = ?").bind(userId);
  const profileStmt = c.env.DB.prepare("UPDATE profiles SET verification_status = 'SUSPENDED', updated_at = datetime('now') WHERE user_id = ?").bind(userId);
  const auditStmt = c.env.DB.prepare(`INSERT INTO audit_logs (id, actor_id, actor_role, action, entity_type, entity_id) VALUES (?, ?, ?, ?, ?, ?)`).bind(crypto.randomUUID().replace(/-/g, ''), adminUser.id, 'ADMIN', 'USER_SUSPENDED', 'USER', userId);

  try {
    await c.env.DB.batch([userStmt, profileStmt, auditStmt]);
    return c.json({ success: true, data: { message: 'User suspended' } });
  } catch (error) {
    return c.json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to suspend user' } }, 500);
  }
});

export default router;
