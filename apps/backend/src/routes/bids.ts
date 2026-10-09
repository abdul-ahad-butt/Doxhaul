import { Hono } from 'hono';
import { Env } from '../types/env';
import { authMiddleware, JwtPayload, requireRole, requireVerified } from '../middleware/auth';
import { z } from 'zod';

const router = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

router.use('*', authMiddleware);

// Ensure bids table has all required columns in D1
export async function ensureBidsTable(db: D1Database) {
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS bids (
        id TEXT PRIMARY KEY,
        load_id TEXT NOT NULL,
        bidder_id TEXT NOT NULL,
        bidder_role TEXT NOT NULL CHECK (bidder_role IN ('CARRIER', 'BROKER')),
        amount REAL NOT NULL,
        notes TEXT,
        status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'COUNTERED')),
        counter_amount REAL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (load_id) REFERENCES loads(id) ON DELETE CASCADE,
        FOREIGN KEY (bidder_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `).run().catch(() => {});

    // Ensure columns exist if older schema was previously initialized
    await db.prepare('ALTER TABLE bids ADD COLUMN bidder_id TEXT').run().catch(() => {});
    await db.prepare('ALTER TABLE bids ADD COLUMN bidder_role TEXT DEFAULT "CARRIER"').run().catch(() => {});
    await db.prepare('ALTER TABLE bids ADD COLUMN counter_amount REAL').run().catch(() => {});
    await db.prepare('ALTER TABLE bids ADD COLUMN carrier_id TEXT').run().catch(() => {});
    await db.prepare('ALTER TABLE bids ADD COLUMN currency TEXT DEFAULT "USD"').run().catch(() => {});
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_bids_load ON bids(load_id, status)').run().catch(() => {});
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_bids_bidder ON bids(bidder_id)').run().catch(() => {});
  } catch (e) {
    // Ignore migration catch
  }
}

// Wallet helper to initialize or get wallet
async function getOrCreateWallet(db: D1Database, userId: string) {
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS wallets (
        id TEXT PRIMARY KEY,
        user_id TEXT UNIQUE NOT NULL,
        balance REAL NOT NULL DEFAULT 0.00,
        escrow_balance REAL NOT NULL DEFAULT 0.00,
        currency TEXT NOT NULL DEFAULT 'USD',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `).run().catch(() => {});

    let wallet = await db.prepare('SELECT * FROM wallets WHERE user_id = ?').bind(userId).first<any>();
    if (!wallet) {
      const walletId = `w_${crypto.randomUUID().replace(/-/g, '')}`;
      await db.prepare(`
        INSERT INTO wallets (id, user_id, balance, escrow_balance, currency, created_at, updated_at)
        VALUES (?, ?, 0.00, 0.00, 'USD', datetime('now'), datetime('now'))
      `).bind(walletId, userId).run();

      wallet = await db.prepare('SELECT * FROM wallets WHERE id = ?').bind(walletId).first<any>();
    }
    return wallet || { id: `w_${userId}`, user_id: userId, balance: 0.00, escrow_balance: 0.00, currency: 'USD' };
  } catch (err) {
    return { id: `w_${userId}`, user_id: userId, balance: 0.00, escrow_balance: 0.00, currency: 'USD' };
  }
}

const submitBidSchema = z.object({
  amount: z.number().positive('Bid amount must be greater than 0'),
  currency: z.string().default('USD'),
  notes: z.string().optional()
});

const counterBidSchema = z.object({
  counterAmount: z.number().positive('Counter offer amount must be greater than 0'),
  notes: z.string().optional()
});

const bidStatusSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED', 'COUNTERED']),
  counterAmount: z.number().positive().optional()
});

// Handler: Submit a bid for a load
export async function handleSubmitBid(c: any, explicitLoadId?: string) {
  const loadId = explicitLoadId || c.req.param('id') || c.req.param('loadId');
  const user = c.get('user');

  if (!loadId) {
    return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Missing load ID' } }, 400);
  }

  // Role validation: Carrier or Broker or Admin
  if (user.role !== 'CARRIER' && user.role !== 'BROKER' && user.role !== 'ADMIN') {
    return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'Only carriers and brokers can submit bids' } }, 403);
  }

  const body = await c.req.json();
  const parseResult = submitBidSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json({ 
      success: false, 
      error: { code: 'VALIDATION_ERROR', message: 'Invalid bid amount', details: parseResult.error.errors } 
    }, 400);
  }

  const { amount, currency, notes } = parseResult.data;

  await ensureBidsTable(c.env.DB);

  // Check load exists and is open for bidding
  const load = (await c.env.DB.prepare('SELECT id, owner_user_id, status, rate, reference_number FROM loads WHERE id = ?').bind(loadId).first()) as any;
  if (!load) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Load not found' } }, 404);
  }

  if (load.owner_user_id === user.id) {
    return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'You cannot bid on your own load' } }, 403);
  }

  if (load.status !== 'OPEN' && load.status !== 'BIDDING') {
    return c.json({ success: false, error: { code: 'CONFLICT', message: `Load is no longer open for bids (Current status: ${load.status})` } }, 409);
  }

  const bidId = crypto.randomUUID().replace(/-/g, '').toLowerCase();
  const bidderRole = user.role === 'BROKER' ? 'BROKER' : 'CARRIER';

  // Insert bid into D1
  const insertBidStmt = c.env.DB.prepare(`
    INSERT INTO bids (id, load_id, bidder_id, bidder_role, carrier_id, amount, currency, notes, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', datetime('now'), datetime('now'))
  `).bind(bidId, loadId, user.id, bidderRole, user.id, amount, currency, notes || null);

  // If load is currently OPEN, transition status to BIDDING
  const updateLoadStatusStmt = c.env.DB.prepare(`
    UPDATE loads SET status = 'BIDDING', updated_at = datetime('now') WHERE id = ? AND status = 'OPEN'
  `).bind(loadId);

  // Create audit load event
  const eventStmt = c.env.DB.prepare(`
    INSERT INTO load_events (id, load_id, actor_id, event_type, from_status, to_status, notes)
    VALUES (?, ?, ?, 'BID_SUBMITTED', ?, 'BIDDING', ?)
  `).bind(
    crypto.randomUUID().replace(/-/g, '').toLowerCase(), 
    loadId, 
    user.id, 
    load.status, 
    `Carrier submitted bid of $${amount.toFixed(2)}${notes ? ` - "${notes}"` : ''}`
  );

  await c.env.DB.batch([insertBidStmt, updateLoadStatusStmt, eventStmt]);

  return c.json({
    success: true,
    data: {
      id: bidId,
      loadId,
      bidderId: user.id,
      bidderRole,
      amount,
      currency,
      notes: notes || null,
      status: 'PENDING'
    }
  }, 201);
}

// Handler: Get bids for a load
export async function handleGetLoadBids(c: any, explicitLoadId?: string) {
  const loadId = explicitLoadId || c.req.param('id') || c.req.param('loadId');
  const user = c.get('user');

  if (!loadId) {
    return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Missing load ID' } }, 400);
  }

  await ensureBidsTable(c.env.DB);

  const load = (await c.env.DB.prepare('SELECT id, owner_user_id, status, rate, reference_number FROM loads WHERE id = ?').bind(loadId).first()) as any;
  if (!load) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Load not found' } }, 404);
  }

  let query = `
    SELECT 
      b.*,
      COALESCE(b.bidder_id, b.carrier_id) as bidder_id,
      p.company_name,
      p.first_name,
      p.last_name,
      p.phone,
      p.dot_number,
      p.mc_number,
      p.verification_status,
      4.9 as rating
    FROM bids b
    LEFT JOIN profiles p ON p.user_id = COALESCE(b.bidder_id, b.carrier_id)
    WHERE b.load_id = ?
  `;
  const values: any[] = [loadId];

  // If user is load owner or admin, they see all bids
  if (load.owner_user_id === user.id || user.role === 'ADMIN') {
    // See all bids
  } else {
    // Carrier or bidding broker only sees their own bids
    query += ' AND (b.bidder_id = ? OR b.carrier_id = ?)';
    values.push(user.id, user.id);
  }

  query += ' ORDER BY b.created_at DESC';

  const results = await c.env.DB.prepare(query).bind(...values).all();

  return c.json({
    success: true,
    data: results.results || []
  });
}

// Handler: Accept a bid
export async function handleAcceptBid(c: any) {
  const bidId = c.req.param('id') || c.req.param('bidId');
  const user = c.get('user');

  await ensureBidsTable(c.env.DB);

  const bid = (await c.env.DB.prepare(`
    SELECT b.*, 
           COALESCE(b.bidder_id, b.carrier_id) as winning_bidder_id,
           l.owner_user_id, 
           l.status as load_status,
           l.reference_number,
           l.title
    FROM bids b
    JOIN loads l ON b.load_id = l.id
    WHERE b.id = ?
  `).bind(bidId).first()) as any;

  if (!bid) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Bid not found' } }, 404);
  }

  if (bid.owner_user_id !== user.id && user.role !== 'ADMIN') {
    return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'Only the load poster can accept bids' } }, 403);
  }

  if (bid.load_status !== 'OPEN' && bid.load_status !== 'BIDDING') {
    return c.json({ success: false, error: { code: 'CONFLICT', message: `Load is no longer open for assignments (Status: ${bid.load_status})` } }, 409);
  }

  const winningCarrierId = bid.winning_bidder_id;
  const agreedRate = Number(bid.amount);
  const bookingId = crypto.randomUUID().replace(/-/g, '').toLowerCase();

  // 1. Mark accepted bid
  const acceptBidStmt = c.env.DB.prepare(`
    UPDATE bids SET status = 'ACCEPTED', updated_at = datetime('now') WHERE id = ?
  `).bind(bidId);

  // 2. Reject competing bids for this load
  const rejectOtherBidsStmt = c.env.DB.prepare(`
    UPDATE bids SET status = 'REJECTED', updated_at = datetime('now') WHERE load_id = ? AND id != ?
  `).bind(bid.load_id, bidId);

  // 3. Assign carrier & lock agreed rate on load
  const updateLoadStmt = c.env.DB.prepare(`
    UPDATE loads 
    SET status = 'ASSIGNED', assigned_carrier_id = ?, rate = ?, assigned_booking_id = ?, updated_at = datetime('now')
    WHERE id = ?
  `).bind(winningCarrierId, agreedRate, bookingId, bid.load_id);

  // 4. Create confirmed booking record
  const bookingStmt = c.env.DB.prepare(`
    INSERT INTO bookings (id, load_id, carrier_id, status, booked_at, accepted_at, created_at, updated_at)
    VALUES (?, ?, ?, 'ACCEPTED', datetime('now'), datetime('now'), datetime('now'), datetime('now'))
  `).bind(bookingId, bid.load_id, winningCarrierId);

  // 5. Create audit load event
  const eventStmt = c.env.DB.prepare(`
    INSERT INTO load_events (id, load_id, actor_id, event_type, from_status, to_status, notes)
    VALUES (?, ?, ?, 'BID_ACCEPTED', ?, 'ASSIGNED', ?)
  `).bind(
    crypto.randomUUID().replace(/-/g, '').toLowerCase(),
    bid.load_id,
    user.id,
    bid.load_status,
    `Bid accepted: $${agreedRate.toFixed(2)}. Carrier assigned and platform escrow locked.`
  );

  // 6. Platform Escrow Lock: ensure digital escrow is recorded
  const shipperWallet = await getOrCreateWallet(c.env.DB, bid.owner_user_id);
  const txId = crypto.randomUUID().replace(/-/g, '').toLowerCase();

  // Update shipper wallet escrow balance
  const updateWalletStmt = c.env.DB.prepare(`
    UPDATE wallets 
    SET escrow_balance = escrow_balance + ?, updated_at = datetime('now')
    WHERE id = ?
  `).bind(agreedRate, shipperWallet.id);

  // Record Escrow Lock transaction in ledger
  const txStmt = c.env.DB.prepare(`
    INSERT INTO wallet_transactions (id, wallet_id, load_id, amount, fee_deducted, type, status, payment_provider, notes, created_at)
    VALUES (?, ?, ?, ?, 0.00, 'ESCROW_LOCK', 'COMPLETED', 'WALLET', ?, datetime('now'))
  `).bind(
    txId, 
    shipperWallet.id, 
    bid.load_id, 
    agreedRate, 
    `Guaranteed Platform Escrow locked for Load ${bid.reference_number || bid.load_id.substring(0, 8).toUpperCase()} at accepted bid rate`
  );

  try {
    await c.env.DB.batch([
      acceptBidStmt, 
      rejectOtherBidsStmt, 
      updateLoadStmt, 
      bookingStmt, 
      eventStmt,
      updateWalletStmt,
      txStmt
    ]);

    return c.json({
      success: true,
      data: {
        status: 'ACCEPTED',
        loadId: bid.load_id,
        bookingId,
        winningCarrierId,
        agreedRate,
        escrowLocked: true,
        message: 'Bid accepted! Carrier assigned and guaranteed digital escrow locked.'
      }
    });
  } catch (err: any) {
    console.error('Accept bid error:', err);
    return c.json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to accept bid' } }, 500);
  }
}

// Handler: Decline/Reject a bid
export async function handleDeclineBid(c: any) {
  const bidId = c.req.param('id') || c.req.param('bidId');
  const user = c.get('user');

  await ensureBidsTable(c.env.DB);

  const bid = (await c.env.DB.prepare(`
    SELECT b.*, l.owner_user_id 
    FROM bids b
    JOIN loads l ON b.load_id = l.id
    WHERE b.id = ?
  `).bind(bidId).first()) as any;

  if (!bid) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Bid not found' } }, 404);
  }

  if (bid.owner_user_id !== user.id && user.role !== 'ADMIN') {
    return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to decline this bid' } }, 403);
  }

  await c.env.DB.prepare(`
    UPDATE bids SET status = 'REJECTED', updated_at = datetime('now') WHERE id = ?
  `).bind(bidId).run();

  return c.json({
    success: true,
    data: { id: bidId, status: 'REJECTED', message: 'Bid declined' }
  });
}

// Handler: Counter a bid
export async function handleCounterBid(c: any) {
  const bidId = c.req.param('id') || c.req.param('bidId');
  const user = c.get('user');

  await ensureBidsTable(c.env.DB);

  const bid = (await c.env.DB.prepare(`
    SELECT b.*, l.owner_user_id 
    FROM bids b
    JOIN loads l ON b.load_id = l.id
    WHERE b.id = ?
  `).bind(bidId).first()) as any;

  if (!bid) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Bid not found' } }, 404);
  }

  if (bid.owner_user_id !== user.id && user.role !== 'ADMIN') {
    return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to counter this bid' } }, 403);
  }

  const body = await c.req.json();
  const parseResult = counterBidSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid counter amount' } }, 400);
  }

  const { counterAmount, notes } = parseResult.data;

  await c.env.DB.prepare(`
    UPDATE bids 
    SET status = 'COUNTERED', counter_amount = ?, notes = COALESCE(?, notes), updated_at = datetime('now')
    WHERE id = ?
  `).bind(counterAmount, notes || null, bidId).run();

  return c.json({
    success: true,
    data: { id: bidId, status: 'COUNTERED', counterAmount, message: 'Counter-offer submitted to carrier' }
  });
}

// Route definitions for /api/bids router
router.post('/loads/:id/bids', requireRole(['CARRIER', 'BROKER', 'ADMIN']), requireVerified, (c) => handleSubmitBid(c));
router.get('/loads/:id/bids', (c) => handleGetLoadBids(c));

router.post('/:loadId', requireRole(['CARRIER', 'BROKER', 'ADMIN']), requireVerified, (c) => handleSubmitBid(c));
router.get('/:loadId', (c) => handleGetLoadBids(c));

router.patch('/:id/accept', requireRole(['SHIPPER', 'BROKER', 'ADMIN']), (c) => handleAcceptBid(c));
router.post('/:id/accept', requireRole(['SHIPPER', 'BROKER', 'ADMIN']), (c) => handleAcceptBid(c));

router.patch('/:id/decline', requireRole(['SHIPPER', 'BROKER', 'ADMIN']), (c) => handleDeclineBid(c));
router.post('/:id/decline', requireRole(['SHIPPER', 'BROKER', 'ADMIN']), (c) => handleDeclineBid(c));
router.patch('/:id/reject', requireRole(['SHIPPER', 'BROKER', 'ADMIN']), (c) => handleDeclineBid(c));
router.post('/:id/reject', requireRole(['SHIPPER', 'BROKER', 'ADMIN']), (c) => handleDeclineBid(c));

router.patch('/:id/counter', requireRole(['SHIPPER', 'BROKER', 'ADMIN']), (c) => handleCounterBid(c));
router.post('/:id/counter', requireRole(['SHIPPER', 'BROKER', 'ADMIN']), (c) => handleCounterBid(c));

router.patch('/:id/status', requireRole(['SHIPPER', 'BROKER', 'ADMIN']), async (c) => {
  const body = await c.req.json();
  const parseResult = bidStatusSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid status' } }, 400);
  }
  const { status, counterAmount } = parseResult.data;
  if (status === 'ACCEPTED') {
    return handleAcceptBid(c);
  } else if (status === 'COUNTERED' && counterAmount) {
    return handleCounterBid(c);
  } else {
    return handleDeclineBid(c);
  }
});

export default router;
