import { Hono } from 'hono';
import { Env } from '../types/env';
import { authMiddleware, JwtPayload, requireRole, requireVerified } from '../middleware/auth';
import { z } from 'zod';

const router = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

router.use('*', authMiddleware);

const bidSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  notes: z.string().optional()
});

// Carrier submit bid
router.post('/loads/:id/bids', requireRole(['CARRIER']), requireVerified, async (c) => {
  const loadId = c.req.param('id');
  const user = c.get('user');
  const body = await c.req.json();

  const parseResult = bidSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: parseResult.error.errors } }, 400);
  }

  const { amount, currency, notes } = parseResult.data;

  // Check if load is OPEN
  const load = await c.env.DB.prepare('SELECT id, status FROM loads WHERE id = ?').bind(loadId).first<{id: string, status: string}>();
  if (!load) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Load not found' } }, 404);
  }
  if (load.status !== 'OPEN') {
    return c.json({ success: false, error: { code: 'CONFLICT', message: 'Load is no longer open for bids' } }, 409);
  }

  // Check if already booked by this carrier
  const existingBooking = await c.env.DB.prepare('SELECT id FROM bookings WHERE load_id = ? AND carrier_id = ?').bind(loadId, user.id).first();
  if (existingBooking) {
    return c.json({ success: false, error: { code: 'CONFLICT', message: 'You have already booked this load' } }, 409);
  }

  const bidId = crypto.randomUUID().replace(/-/g, '').toLowerCase();

  await c.env.DB.prepare(`
    INSERT INTO bids (id, load_id, carrier_id, amount, currency, notes, status)
    VALUES (?, ?, ?, ?, ?, ?, 'PENDING')
  `).bind(bidId, loadId, user.id, amount, currency, notes || null).run();

  return c.json({ success: true, data: { id: bidId, loadId, amount, currency, status: 'PENDING' } }, 201);
});

// Get bids for a load
router.get('/loads/:id/bids', async (c) => {
  const loadId = c.req.param('id');
  const user = c.get('user');

  const load = await c.env.DB.prepare('SELECT owner_user_id FROM loads WHERE id = ?').bind(loadId).first<{owner_user_id: string}>();
  if (!load) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Load not found' } }, 404);
  }

  let query = `
    SELECT b.*, p.company_name, p.first_name, p.last_name, p.phone
    FROM bids b
    JOIN profiles p ON b.carrier_id = p.user_id
    WHERE b.load_id = ?
  `;
  const values: any[] = [loadId];

  // If carrier, only see their own bids
  if (user.role === 'CARRIER') {
    query += ' AND b.carrier_id = ?';
    values.push(user.id);
  } else if (user.role === 'SHIPPER' || user.role === 'BROKER') {
    if (load.owner_user_id !== user.id) {
      return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized' } }, 403);
    }
  }

  query += ' ORDER BY b.created_at DESC';

  const results = await c.env.DB.prepare(query).bind(...values).all();

  return c.json({ success: true, data: results.results });
});

const bidStatusSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED', 'COUNTERED'])
});

// Update bid status (Accept/Reject)
router.patch('/bids/:id/status', requireRole(['SHIPPER', 'BROKER']), async (c) => {
  const bidId = c.req.param('id');
  const user = c.get('user');
  const body = await c.req.json();

  const parseResult = bidStatusSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid status' } }, 400);
  }

  const { status } = parseResult.data;

  // Get bid and load
  const bid = await c.env.DB.prepare(`
    SELECT b.*, l.owner_user_id, l.status as load_status 
    FROM bids b
    JOIN loads l ON b.load_id = l.id
    WHERE b.id = ?
  `).bind(bidId).first<any>();

  if (!bid) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Bid not found' } }, 404);
  }

  if (bid.owner_user_id !== user.id) {
    return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized' } }, 403);
  }

  if (bid.load_status !== 'OPEN') {
    return c.json({ success: false, error: { code: 'CONFLICT', message: 'Load is no longer open' } }, 409);
  }

  if (status === 'ACCEPTED') {
    // 1. Update this bid to ACCEPTED
    const acceptBidStmt = c.env.DB.prepare('UPDATE bids SET status = ? WHERE id = ?').bind('ACCEPTED', bidId);
    
    // 2. Reject other bids
    const rejectBidsStmt = c.env.DB.prepare('UPDATE bids SET status = ? WHERE load_id = ? AND id != ?').bind('REJECTED', bid.load_id, bidId);

    // 3. Mark load as ASSIGNED
    const updateLoadStmt = c.env.DB.prepare(`
      UPDATE loads SET status = 'ASSIGNED', assigned_carrier_id = ?, rate = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(bid.carrier_id, bid.amount, bid.load_id);

    const bookingId = crypto.randomUUID().replace(/-/g, '').toLowerCase();

    // 4. Create booking
    const bookingStmt = c.env.DB.prepare(`
      INSERT INTO bookings (id, load_id, carrier_id, status)
      VALUES (?, ?, ?, 'ACCEPTED')
    `).bind(bookingId, bid.load_id, bid.carrier_id);

    const loadUpdateStmt2 = c.env.DB.prepare(`
      UPDATE loads SET assigned_booking_id = ? WHERE id = ?
    `).bind(bookingId, bid.load_id);

    const eventStmt = c.env.DB.prepare(`
      INSERT INTO load_events (id, load_id, actor_id, event_type, from_status, to_status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(crypto.randomUUID().replace(/-/g, '').toLowerCase(), bid.load_id, user.id, 'BID_ACCEPTED', 'OPEN', 'ASSIGNED', 'Bid accepted and carrier assigned');

    try {
      await c.env.DB.batch([acceptBidStmt, rejectBidsStmt, updateLoadStmt, bookingStmt, loadUpdateStmt2, eventStmt]);
      return c.json({ success: true, data: { status: 'ACCEPTED', loadId: bid.load_id } });
    } catch (e) {
      console.error(e);
      return c.json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to accept bid' } }, 500);
    }
  } else {
    // Just REJECTED or COUNTERED
    await c.env.DB.prepare('UPDATE bids SET status = ? WHERE id = ?').bind(status, bidId).run();
    return c.json({ success: true, data: { status } });
  }
});

export default router;
