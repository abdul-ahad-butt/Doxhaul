import { Hono } from 'hono';
import { Env } from '../types/env';
import { authMiddleware, JwtPayload, requireRole, requireVerified } from '../middleware/auth';
import { z } from 'zod';

const router = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

router.use('*', authMiddleware);

// Book a load
router.post('/loads/:id/book', requireRole(['CARRIER']), requireVerified, async (c) => {
  const loadId = c.req.param('id');
  const user = c.get('user');

  // We need to use atomic operations. We'll simulate this with a transaction pattern if possible, 
  // or use D1 batch. A conditional update is the safest way to prevent race conditions.
  
  // 1. Check if load is OPEN
  const load = await c.env.DB.prepare('SELECT id, status FROM loads WHERE id = ?').bind(loadId).first<{id: string, status: string}>();
  if (!load) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Load not found' } }, 404);
  }
  
  if (load.status !== 'OPEN') {
    return c.json({ success: false, error: { code: 'CONFLICT', message: 'Load is no longer available' } }, 409);
  }

  // 2. Atomic update: Update status to ASSIGNED only if it's still OPEN
  const updateResult = await c.env.DB.prepare(`
    UPDATE loads 
    SET status = 'ASSIGNED', assigned_carrier_id = ?, updated_at = datetime('now') 
    WHERE id = ? AND status = 'OPEN'
  `).bind(user.id, loadId).run();

  // If no rows were changed, it means another request already booked it or status changed
  if (updateResult.meta.changes === 0) {
    return c.json({ success: false, error: { code: 'CONFLICT', message: 'Load is no longer available' } }, 409);
  }

  const bookingId = crypto.randomUUID().replace(/-/g, '').toLowerCase();

  // 3. Create booking record
  const bookingStmt = c.env.DB.prepare(`
    INSERT INTO bookings (id, load_id, carrier_id, status)
    VALUES (?, ?, ?, 'ACCEPTED')
  `).bind(bookingId, loadId, user.id);

  // 4. Create load event
  const eventStmt = c.env.DB.prepare(`
    INSERT INTO load_events (id, load_id, actor_id, event_type, from_status, to_status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(crypto.randomUUID().replace(/-/g, '').toLowerCase(), loadId, user.id, 'BOOKING_ACCEPTED', 'OPEN', 'ASSIGNED', 'Load booked successfully');

  // Update load with booking ID reference
  const loadUpdateStmt = c.env.DB.prepare(`
    UPDATE loads SET assigned_booking_id = ? WHERE id = ?
  `).bind(bookingId, loadId);

  try {
    await c.env.DB.batch([bookingStmt, eventStmt, loadUpdateStmt]);
    return c.json({ success: true, data: { bookingId, loadId, status: 'ASSIGNED' } }, 201);
  } catch (error) {
    // In a real transactional system we would rollback, but D1 batch is somewhat transactional.
    // However, the first update was executed. If batch fails, we have an inconsistent state.
    // For D1, it's safer to put everything in a single batch if possible. Since we can't easily 
    // conditionally update and get the result in one query to decide on the next, this is a compromise.
    // To be perfectly robust, all writes should be in one batch or handled via durable objects.
    console.error('Booking error:', error);
    return c.json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Booking failed' } }, 500);
  }
});

// Get user bookings
router.get('/', async (c) => {
  const user = c.get('user');
  
  let query = `
    SELECT b.*, l.reference_number, l.title, l.origin_city, l.origin_state, l.destination_city, l.destination_state, l.pickup_date, l.delivery_date, l.rate, l.status as load_status
    FROM bookings b
    JOIN loads l ON b.load_id = l.id
  `;
  
  const values: any[] = [];
  
  if (user.role === 'CARRIER') {
    query += ' WHERE b.carrier_id = ?';
    values.push(user.id);
  } else {
    // Shippers/Brokers see bookings for their loads
    query += ' WHERE l.owner_user_id = ?';
    values.push(user.id);
  }

  query += ' ORDER BY b.created_at DESC';

  const results = await c.env.DB.prepare(query).bind(...values).all();

  return c.json({ success: true, data: results.results });
});

const statusSchema = z.object({
  status: z.enum(['HEADING_TO_PICKUP', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'])
});

// Update load status (Trip management)
router.post('/loads/:id/status', requireRole(['CARRIER']), requireVerified, async (c) => {
  const loadId = c.req.param('id');
  const user = c.get('user');
  const body = await c.req.json();

  const parseResult = statusSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid status' } }, 400);
  }

  const { status: newStatus } = parseResult.data;

  const load = await c.env.DB.prepare('SELECT id, status, assigned_carrier_id FROM loads WHERE id = ?').bind(loadId).first();
  
  if (!load) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Load not found' } }, 404);
  }

  if (load.assigned_carrier_id !== user.id) {
    return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized for this load' } }, 403);
  }

  // Validate state transitions
  const validTransitions: Record<string, string[]> = {
    'ASSIGNED': ['HEADING_TO_PICKUP', 'CANCELLED'],
    'HEADING_TO_PICKUP': ['PICKED_UP', 'CANCELLED'],
    'PICKED_UP': ['IN_TRANSIT'],
    'IN_TRANSIT': ['DELIVERED'],
    'DELIVERED': [],
    'CANCELLED': []
  };

  const allowedNext = validTransitions[load.status as string] || [];
  if (!allowedNext.includes(newStatus)) {
    return c.json({ 
      success: false, 
      error: { code: 'BAD_REQUEST', message: `Invalid status transition from ${load.status} to ${newStatus}` } 
    }, 400);
  }

  // Update load
  const loadStmt = c.env.DB.prepare(`
    UPDATE loads SET status = ?, updated_at = datetime('now') WHERE id = ?
  `).bind(newStatus, loadId);

  // Update booking if completed
  let bookingStmt = null;
  if (newStatus === 'DELIVERED') {
    bookingStmt = c.env.DB.prepare(`
      UPDATE bookings SET status = 'COMPLETED', completed_at = datetime('now'), updated_at = datetime('now') WHERE load_id = ? AND carrier_id = ?
    `).bind(loadId, user.id);
  }

  // Add event
  const eventStmt = c.env.DB.prepare(`
    INSERT INTO load_events (id, load_id, actor_id, event_type, from_status, to_status)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(crypto.randomUUID().replace(/-/g, '').toLowerCase(), loadId, user.id, 'STATUS_UPDATE', load.status, newStatus);

  try {
    const batch = [loadStmt, eventStmt];
    if (bookingStmt) batch.push(bookingStmt);
    
    await c.env.DB.batch(batch);
    
    return c.json({ success: true, data: { loadId, status: newStatus } });
  } catch (error) {
    return c.json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update status' } }, 500);
  }
});

export default router;
