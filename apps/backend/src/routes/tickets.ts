import { Hono } from 'hono';
import { Env } from '../types/env';
import { authMiddleware, optionalAuthMiddleware, JwtPayload } from '../middleware/auth';
import { StorageService } from '../services/storage';

const router = new Hono<{ Bindings: Env, Variables: { user?: JwtPayload } }>();

router.post('/', optionalAuthMiddleware, async (c) => {
  const user = c.get('user');
  const formData = await c.req.parseBody();
  
  const firstName = formData['firstName'] as string;
  const lastName = formData['lastName'] as string;
  const email = formData['email'] as string;
  const category = formData['category'] as string;
  const message = formData['message'] as string;
  const file = formData['file'] as File | undefined;
  
  if (!firstName || !lastName || !email || !category || !message) {
    return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Missing required fields' } }, 400);
  }

  let objectKey: string | null = null;

  if (file && file.size > 0) {
    if (file.size > 5 * 1024 * 1024) {
      return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'File too large (max 5MB)' } }, 400);
    }
    const storage = new StorageService(c.env.DOCUMENTS);
    objectKey = `support/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    await storage.uploadFile(objectKey, file);
  }

  const ticketId = crypto.randomUUID().replace(/-/g, '').toLowerCase();

  await c.env.DB.prepare(`
    INSERT INTO support_tickets (id, user_id, first_name, last_name, email, category, message, screenshot_r2_key, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'OPEN')
  `).bind(
    ticketId, 
    user?.id || null, 
    firstName, 
    lastName, 
    email, 
    category, 
    message, 
    objectKey
  ).run();

  return c.json({ success: true, data: { id: ticketId } }, 201);
});

router.get('/', authMiddleware, async (c) => {
  const user = c.get('user');
  if (user?.role !== 'ADMIN') {
    return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'Admin access required' } }, 403);
  }

  const status = c.req.query('status');
  const category = c.req.query('category');
  
  let query = 'SELECT * FROM support_tickets WHERE 1=1';
  const params: any[] = [];
  
  if (status && status !== 'ALL') {
    query += ' AND status = ?';
    params.push(status);
  }
  
  if (category && category !== 'ALL') {
    query += ' AND category = ?';
    params.push(category);
  }
  
  query += ' ORDER BY created_at DESC';
  
  const results = await c.env.DB.prepare(query).bind(...params).all();

  return c.json({ success: true, data: results.results });
});

router.patch('/:id/status', authMiddleware, async (c) => {
  const user = c.get('user');
  if (user?.role !== 'ADMIN') {
    return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'Admin access required' } }, 403);
  }

  const id = c.req.param('id');
  const body = await c.req.json();
  
  if (!body.status || !['OPEN', 'IN_PROGRESS', 'RESOLVED'].includes(body.status)) {
    return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Invalid status' } }, 400);
  }

  await c.env.DB.prepare(`
    UPDATE support_tickets SET status = ?, updated_at = datetime('now') WHERE id = ?
  `).bind(body.status, id).run();

  return c.json({ success: true, data: { success: true } });
});

router.get('/:id/view-screenshot', authMiddleware, async (c) => {
  const user = c.get('user');
  if (user?.role !== 'ADMIN') {
    return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'Admin access required' } }, 403);
  }

  const id = c.req.param('id');
  const ticket = await c.env.DB.prepare('SELECT * FROM support_tickets WHERE id = ?').bind(id).first();
  
  if (!ticket || !ticket.screenshot_r2_key) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Screenshot not found' } }, 404);
  }

  const storage = new StorageService(c.env.DOCUMENTS);
  const file = await storage.getFile(ticket.screenshot_r2_key as string);
  
  if (!file) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'File not found in storage' } }, 404);
  }

  const originalFilename = (ticket.screenshot_r2_key as string).split('/').pop() || 'screenshot.png';
  const contentType = originalFilename.endsWith('.jpg') || originalFilename.endsWith('.jpeg') ? 'image/jpeg' : 'image/png';
  
  c.header('Content-Type', contentType);
  c.header('Content-Disposition', `inline; filename="${originalFilename}"`);
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  
  return c.body(file.body);
});

export default router;
