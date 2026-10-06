import { Hono } from 'hono';
import { Env } from '../types/env';
import { authMiddleware, optionalAuthMiddleware, JwtPayload } from '../middleware/auth';
import { StorageService } from '../services/storage';

const router = new Hono<{ Bindings: Env, Variables: { user?: JwtPayload } }>();

router.post('/', optionalAuthMiddleware, async (c) => {
  const user = c.get('user');
  const formData = await c.req.parseBody();
  
  const rawName = (formData['name'] as string) || '';
  const firstName = (formData['firstName'] as string) || (rawName ? rawName.split(' ')[0] : '');
  const lastName = (formData['lastName'] as string) || (rawName ? rawName.split(' ').slice(1).join(' ') : '');
  const fullName = rawName || `${firstName} ${lastName}`.trim();
  const email = formData['email'] as string;
  let category = formData['category'] as string;
  const message = formData['message'] as string;
  const file = formData['file'] as File | undefined;
  
  if (!email || !message) {
    return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Missing required fields' } }, 400);
  }

  // Normalize category if needed
  if (!category) {
    category = 'TECHNICAL';
  }

  let objectKey: string | null = null;

  if (file && file.size > 0) {
    if (file.size > 10 * 1024 * 1024) {
      return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'File too large (max 10MB)' } }, 400);
    }
    const bucket = c.env.DOCUMENTS || (c.env as any).DOCUMENTS_BUCKET;
    const storage = new StorageService(bucket);
    objectKey = `support/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    await storage.uploadFile(objectKey, file);
  }

  const ticketId = crypto.randomUUID().replace(/-/g, '').toLowerCase();

  await c.env.DB.prepare(`
    INSERT INTO support_tickets (id, user_id, name, first_name, last_name, email, category, message, screenshot_r2_key, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'OPEN')
  `).bind(
    ticketId, 
    user?.id || null, 
    fullName,
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
    if (category === 'PLATFORM') {
      query += " AND (category = 'PLATFORM' OR category = 'PLATFORM_INQUIRY')";
    } else {
      query += ' AND category = ?';
      params.push(category);
    }
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
  const ticket = (await c.env.DB.prepare('SELECT * FROM support_tickets WHERE id = ?').bind(id).first()) as any;
  
  if (!ticket || !ticket.screenshot_r2_key) {
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Content-Type', 'application/json');
    return new Response(JSON.stringify({ success: false, error: { code: 'NOT_FOUND', message: 'Screenshot not found' } }), { status: 404, headers });
  }

  const bucket = c.env.DOCUMENTS || (c.env as any).DOCUMENTS_BUCKET;
  const storage = new StorageService(bucket);
  const file = await storage.getFile(ticket.screenshot_r2_key as string);
  
  if (!file) {
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Content-Type', 'application/json');
    return new Response(JSON.stringify({ success: false, error: { code: 'NOT_FOUND', message: 'File not found in storage' } }), { status: 404, headers });
  }

  const originalFilename = (ticket.screenshot_r2_key as string).split('/').pop() || 'screenshot.png';
  const contentType = originalFilename.match(/\.(jpg|jpeg)$/i) ? 'image/jpeg' : originalFilename.match(/\.png$/i) ? 'image/png' : 'image/jpeg';
  
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  headers.set('Content-Type', contentType);
  headers.set('Content-Disposition', `inline; filename="${originalFilename}"`);
  
  return new Response(file.body, { headers });
});

router.options('/:id/view-screenshot', () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    }
  });
});

export default router;
