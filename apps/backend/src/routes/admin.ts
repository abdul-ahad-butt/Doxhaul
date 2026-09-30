import { Hono } from 'hono';
import { Env } from '../types/env';
import { authMiddleware, JwtPayload, requireRole } from '../middleware/auth';
import { StorageService } from '../services/storage';

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
    SELECT 
      u.id, 
      u.email, 
      u.role, 
      u.status as user_status, 
      u.created_at, 
      p.first_name, 
      p.last_name, 
      p.company_name, 
      p.verification_status,
      (SELECT COUNT(*) FROM documents d WHERE d.user_id = u.id AND d.status = 'REJECTED') as rejected_docs_count,
      (SELECT COUNT(*) FROM documents d WHERE d.user_id = u.id AND d.status = 'APPROVED') as approved_docs_count,
      (SELECT COUNT(*) FROM documents d WHERE d.user_id = u.id AND d.status = 'PENDING') as pending_docs_count,
      (SELECT COUNT(*) FROM documents d WHERE d.user_id = u.id) as total_docs_count
    FROM users u
    LEFT JOIN profiles p ON u.id = p.user_id
    ORDER BY u.created_at DESC
  `).all();

  const formatted = (users.results || []).map((u: any) => {
    let computedStatus = 'PENDING';
    const vStatus = (u.verification_status || '').toUpperCase();
    const rejectedDocs = Number(u.rejected_docs_count || 0);
    const approvedDocs = Number(u.approved_docs_count || 0);
    const pendingDocs = Number(u.pending_docs_count || 0);
    const totalDocs = Number(u.total_docs_count || 0);

    // Dynamic compliance computation:
    // 1. If profile verification_status is REJECTED or any document is REJECTED -> REJECTED
    // 2. If profile is APPROVED/VERIFIED and all documents are approved (at least 1 approved, 0 pending) -> VERIFIED
    // 3. Otherwise -> PENDING
    // Do NOT hardcode ADMIN users to always show VERIFIED
    if (vStatus === 'REJECTED' || rejectedDocs > 0) {
      computedStatus = 'REJECTED';
    } else if ((vStatus === 'APPROVED' || vStatus === 'VERIFIED') && approvedDocs > 0 && pendingDocs === 0) {
      computedStatus = 'VERIFIED';
    } else {
      computedStatus = 'PENDING';
    }

    return {
      id: u.id,
      email: u.email,
      role: u.role,
      status: computedStatus,
      raw_status: u.user_status,
      verification_status: computedStatus,
      created_at: u.created_at,
      first_name: u.first_name,
      last_name: u.last_name,
      company_name: u.company_name,
      total_docs: totalDocs,
      approved_docs: approvedDocs,
      rejected_docs: rejectedDocs,
      pending_docs: pendingDocs
    };
  });

  return c.json({ success: true, data: formatted });
});

router.get('/users/:id/documents', async (c) => {
  const userId = c.req.param('id');
  const documents = await c.env.DB.prepare('SELECT * FROM documents WHERE user_id = ? ORDER BY uploaded_at DESC').bind(userId).all();
  return c.json({ success: true, data: documents.results });
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

// Helper for approving user & documents
async function handleApprove(c: any) {
  const paramId = c.req.param('id');
  const adminUser = c.get('user');

  // Check if paramId is a document ID or user ID
  const doc = (await c.env.DB.prepare('SELECT id, user_id FROM documents WHERE id = ?').bind(paramId).first()) as { id: string; user_id: string } | null;
  const userId = doc ? doc.user_id : paramId;

  const userStmt = c.env.DB.prepare("UPDATE users SET status = 'ACTIVE', updated_at = datetime('now') WHERE id = ?").bind(userId);
  const profileStmt = c.env.DB.prepare("UPDATE profiles SET verification_status = 'VERIFIED', updated_at = datetime('now') WHERE user_id = ?").bind(userId);
  const docsStmt = c.env.DB.prepare("UPDATE documents SET status = 'APPROVED', reviewed_by = ?, reviewed_at = datetime('now'), updated_at = datetime('now') WHERE user_id = ? OR id = ?").bind(adminUser.id, userId, paramId);
  const auditStmt = c.env.DB.prepare(`INSERT INTO audit_logs (id, actor_id, actor_role, action, entity_type, entity_id) VALUES (?, ?, ?, ?, ?, ?)`).bind(crypto.randomUUID().replace(/-/g, ''), adminUser.id, 'ADMIN', 'USER_VERIFIED', 'USER', userId);

  try {
    await c.env.DB.batch([userStmt, profileStmt, docsStmt, auditStmt]);
    return c.json({ success: true, data: { message: 'User and documents verified successfully' } });
  } catch (error) {
    console.error('Approve verification error:', error);
    return c.json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to approve verification' } }, 500);
  }
}

// Helper for rejecting user & documents
async function handleReject(c: any) {
  const paramId = c.req.param('id');
  const adminUser = c.get('user');
  const body = await c.req.json().catch(() => ({}));
  const reason = body.reason || "Document verification declined. Please upload a clear and valid driver's license.";

  // Check if paramId is a document ID or user ID
  const doc = (await c.env.DB.prepare('SELECT id, user_id FROM documents WHERE id = ?').bind(paramId).first()) as { id: string; user_id: string } | null;
  const userId = doc ? doc.user_id : paramId;

  const profileStmt = c.env.DB.prepare("UPDATE profiles SET verification_status = 'REJECTED', verification_notes = ?, updated_at = datetime('now') WHERE user_id = ?").bind(reason, userId);
  const docsStmt = c.env.DB.prepare("UPDATE documents SET status = 'REJECTED', rejection_reason = ?, reviewed_by = ?, reviewed_at = datetime('now'), updated_at = datetime('now') WHERE user_id = ? OR id = ?").bind(reason, adminUser.id, userId, paramId);
  const userStmt = c.env.DB.prepare("UPDATE users SET status = 'PENDING_VERIFICATION', updated_at = datetime('now') WHERE id = ?").bind(userId);
  const auditStmt = c.env.DB.prepare(`INSERT INTO audit_logs (id, actor_id, actor_role, action, entity_type, entity_id, metadata) VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(crypto.randomUUID().replace(/-/g, ''), adminUser.id, 'ADMIN', 'USER_REJECTED', 'USER', userId, JSON.stringify({ reason, documentId: doc ? doc.id : undefined }));

  try {
    await c.env.DB.batch([profileStmt, docsStmt, userStmt, auditStmt]);
    return c.json({ success: true, data: { message: 'Verification rejected successfully' } });
  } catch (error) {
    console.error('Reject verification error:', error);
    return c.json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to reject verification' } }, 500);
  }
}

router.post('/verifications/:id/approve', handleApprove);
router.post('/documents/:id/approve', handleApprove);

router.post('/verifications/:id/reject', handleReject);
router.post('/documents/:id/reject', handleReject);

// Admin streaming endpoint for documents
router.get('/documents/:id/view', async (c) => {
  const docId = c.req.param('id');
  const doc = (await c.env.DB.prepare('SELECT * FROM documents WHERE id = ?').bind(docId).first()) as {
    id: string;
    object_key: string;
    original_filename: string;
    mime_type: string;
  } | null;

  if (!doc) {
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Content-Type', 'application/json');
    return new Response(JSON.stringify({ success: false, error: { code: 'NOT_FOUND', message: 'Document not found' } }), { status: 404, headers });
  }

  const storage = new StorageService(c.env.DOCUMENTS);
  const file = await storage.getFile(doc.object_key);

  if (!file) {
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Content-Type', 'application/json');
    return new Response(JSON.stringify({ success: false, error: { code: 'NOT_FOUND', message: 'File not found in storage' } }), { status: 404, headers });
  }

  const originalFilename = doc.original_filename || 'document';
  const contentType = doc.mime_type || (originalFilename.match(/\.(jpg|jpeg)$/i) ? 'image/jpeg' : originalFilename.match(/\.png$/i) ? 'image/png' : 'application/octet-stream');

  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  headers.set('Content-Type', contentType);
  headers.set('Content-Disposition', `inline; filename="${originalFilename}"`);

  return new Response(file.body, { headers });
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
