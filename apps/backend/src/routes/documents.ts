import { Hono } from 'hono';
import { Env } from '../types/env';
import { authMiddleware, JwtPayload } from '../middleware/auth';
import { StorageService } from '../services/storage';
import { documentUploadSchema } from '../validators/documents';

const router = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

router.use('*', authMiddleware);

router.post('/', async (c) => {
  const user = c.get('user');
  
  const formData = await c.req.parseBody();
  const file = formData['file'] as File;
  const documentType = formData['documentType'] as string;
  const loadId = formData['loadId'] as string;

  if (!file) {
    return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'No file provided' } }, 400);
  }

  // Validate type
  const parseResult = documentUploadSchema.safeParse({ documentType, loadId });
  if (!parseResult.success) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid document input' } }, 400);
  }

  // Validate size (e.g., max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'File too large (max 10MB)' } }, 400);
  }

  // Validate mime type (allow pdf, images)
  const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (!allowedMimeTypes.includes(file.type)) {
    return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Invalid file type. Only PDF, PNG, JPG allowed.' } }, 400);
  }

  const storage = new StorageService(c.env.DOCUMENTS);
  let objectKey = storage.generateKey(user.id, file.name);
  if (loadId && (documentType === 'POD' || documentType === 'BOL' || documentType === 'RATE_CONFIRMATION')) {
    objectKey = `pod/${loadId}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  }

  try {
    await storage.uploadFile(objectKey, file);

    const docId = crypto.randomUUID().replace(/-/g, '').toLowerCase();
    
    // Insert record
    const result = await c.env.DB.prepare(`
      INSERT INTO documents (id, user_id, document_type, object_key, original_filename, mime_type, file_size)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `).bind(docId, user.id, documentType, objectKey, file.name, file.type, file.size).first();

    // Log audit event
    await c.env.DB.prepare(`
      INSERT INTO audit_logs (id, actor_id, actor_role, action, entity_type, entity_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(crypto.randomUUID().replace(/-/g, '').toLowerCase(), user.id, user.role, 'DOCUMENT_UPLOADED', 'DOCUMENT', docId).run();

    return c.json({ success: true, data: result }, 201);
  } catch (err) {
    console.error('Upload error:', err);
    return c.json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to upload document' } }, 500);
  }
});

router.get('/', async (c) => {
  const user = c.get('user');
  
  const documents = await c.env.DB.prepare('SELECT * FROM documents WHERE user_id = ? ORDER BY created_at DESC')
    .bind(user.id).all();

  return c.json({ success: true, data: documents.results });
});

router.get('/:id/view', async (c) => {
  const user = c.get('user');
  const docId = c.req.param('id');

  // Verify ownership or admin
  let doc;
  if (user.role === 'ADMIN') {
    doc = await c.env.DB.prepare('SELECT * FROM documents WHERE id = ?').bind(docId).first();
  } else {
    doc = await c.env.DB.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?').bind(docId, user.id).first();
  }

  if (!doc) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Document not found' } }, 404);
  }

  // To view/download, we will proxy it through the worker
  const storage = new StorageService(c.env.DOCUMENTS);
  const file = await storage.getFile(doc.object_key as string);
  
  if (!file) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'File not found in storage' } }, 404);
  }

  c.header('Content-Type', doc.mime_type as string);
  c.header('Content-Disposition', `inline; filename="${doc.original_filename}"`);
  
  return c.body(file.body);
});

router.delete('/:id', async (c) => {
  const user = c.get('user');
  const docId = c.req.param('id');

  const doc = await c.env.DB.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?').bind(docId, user.id).first();
  
  if (!doc) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Document not found' } }, 404);
  }

  if (doc.status === 'APPROVED') {
    return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Cannot delete approved documents' } }, 400);
  }

  const storage = new StorageService(c.env.DOCUMENTS);
  await storage.deleteFile(doc.object_key as string);
  
  await c.env.DB.prepare('DELETE FROM documents WHERE id = ?').bind(docId).run();

  return c.json({ success: true, data: { message: 'Document deleted' } });
});

export default router;
