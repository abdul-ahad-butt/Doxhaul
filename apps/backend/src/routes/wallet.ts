import { Hono } from 'hono';
import { Env } from '../types/env';
import { authMiddleware, JwtPayload } from '../middleware/auth';
import { SettingsService } from '../services/settings';
import { PaddleService } from '../services/paddle';
import { z } from 'zod';

const router = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

// Ensure user wallet exists
async function getOrCreateWallet(db: D1Database, userId: string) {
  // Ensure table exists
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
    const walletId = crypto.randomUUID().replace(/-/g, '').toLowerCase();
    await db.prepare(`
      INSERT INTO wallets (id, user_id, balance, escrow_balance, currency)
      VALUES (?, ?, 0.00, 0.00, 'USD')
    `).bind(walletId, userId).run();

    wallet = await db.prepare('SELECT * FROM wallets WHERE id = ?').bind(walletId).first<any>();
  }
  return wallet;
}

// -------------------------------------------------------------
// PUBLIC / AUTH-INDEPENDENT CONFIG
// -------------------------------------------------------------
router.get('/config', async (c) => {
  const settings = await SettingsService.getPlatformSettings(c.env.DB);
  return c.json({
    success: true,
    data: {
      platformFeePercent: settings.platform_fee_percent,
      onboardingFees: {
        CARRIER: settings.carrier_onboarding_fee,
        SHIPPER: settings.shipper_onboarding_fee,
        BROKER: settings.broker_onboarding_fee,
      },
      paddle: {
        environment: settings.paddle_environment,
        vendorId: settings.paddle_vendor_id,
        clientToken: settings.paddle_client_token,
      },
      persona: {
        environment: settings.persona_environment,
        templateId: settings.persona_template_id,
      }
    }
  });
});

// All following routes require authentication
router.use('*', authMiddleware);

// -------------------------------------------------------------
// GET USER WALLET & STATS
// -------------------------------------------------------------
router.get('/', async (c) => {
  const user = c.get('user');
  const wallet = await getOrCreateWallet(c.env.DB, user.id);

  // Financial aggregates
  const earnedStats = await c.env.DB.prepare(`
    SELECT COALESCE(SUM(amount), 0) as total_earned
    FROM wallet_transactions
    WHERE wallet_id = ? AND type = 'ESCROW_RELEASE' AND status = 'COMPLETED'
  `).bind(wallet.id).first<any>().catch(() => ({ total_earned: 0 }));

  const spentStats = await c.env.DB.prepare(`
    SELECT COALESCE(SUM(amount), 0) as total_spent
    FROM wallet_transactions
    WHERE wallet_id = ? AND type = 'ESCROW_LOCK' AND status = 'COMPLETED'
  `).bind(wallet.id).first<any>().catch(() => ({ total_spent: 0 }));

  const feeStats = await c.env.DB.prepare(`
    SELECT COALESCE(SUM(fee_deducted), 0) as total_fees
    FROM wallet_transactions
    WHERE wallet_id = ? AND status = 'COMPLETED'
  `).bind(wallet.id).first<any>().catch(() => ({ total_fees: 0 }));

  const recentTxns = await c.env.DB.prepare(`
    SELECT wt.*, l.reference_number as load_reference, l.title as load_title
    FROM wallet_transactions wt
    LEFT JOIN loads l ON wt.load_id = l.id
    WHERE wt.wallet_id = ?
    ORDER BY wt.created_at DESC
    LIMIT 10
  `).bind(wallet.id).all().catch(() => ({ results: [] }));

  return c.json({
    success: true,
    data: {
      id: wallet.id,
      userId: wallet.user_id,
      balance: Number(wallet.balance || 0),
      escrowBalance: Number(wallet.escrow_balance || 0),
      currency: wallet.currency || 'USD',
      totalEarned: Number(earnedStats?.total_earned || 0),
      totalSpent: Number(spentStats?.total_spent || 0),
      totalFees: Number(feeStats?.total_fees || 0),
      recentTransactions: recentTxns.results || []
    }
  });
});

// -------------------------------------------------------------
// GET WALLET TRANSACTIONS (PAGINATED)
// -------------------------------------------------------------
router.get('/transactions', async (c) => {
  const user = c.get('user');
  const wallet = await getOrCreateWallet(c.env.DB, user.id);

  const page = parseInt(c.req.query('page') || '1');
  const pageSize = parseInt(c.req.query('pageSize') || '20');
  const typeFilter = c.req.query('type');
  const offset = (page - 1) * pageSize;

  let query = `
    SELECT wt.*, l.reference_number as load_reference, l.title as load_title
    FROM wallet_transactions wt
    LEFT JOIN loads l ON wt.load_id = l.id
    WHERE wt.wallet_id = ?
  `;
  const binds: any[] = [wallet.id];

  if (typeFilter && typeFilter !== 'ALL') {
    query += ' AND wt.type = ?';
    binds.push(typeFilter);
  }

  query += ' ORDER BY wt.created_at DESC LIMIT ? OFFSET ?';
  binds.push(pageSize, offset);

  const results = await c.env.DB.prepare(query).bind(...binds).all().catch(() => ({ results: [] }));

  return c.json({
    success: true,
    data: {
      items: results.results || [],
      page,
      pageSize
    }
  });
});

// -------------------------------------------------------------
// DEPOSIT FUNDS (PADDLE / SIMULATED TOP-UP)
// -------------------------------------------------------------
const depositSchema = z.object({
  amount: z.number().positive(),
  paymentMethod: z.string().optional().default('PADDLE')
});

router.post('/deposit', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const parseResult = depositSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid deposit amount' } }, 400);
  }

  const { amount } = parseResult.data;
  const wallet = await getOrCreateWallet(c.env.DB, user.id);
  const settings = await SettingsService.getPlatformSettings(c.env.DB);

  // If Paddle credentials exist and requested, create Paddle transaction
  if (settings.paddle_api_key && body.mode !== 'direct_sandbox') {
    const txn = await PaddleService.createTransaction(settings, {
      amount,
      customerEmail: user.email,
      description: `Doxhaul Wallet Deposit - $${amount.toFixed(2)} USD`,
      customData: {
        type: 'WALLET_DEPOSIT',
        userId: user.id,
        walletId: wallet.id,
        amount
      }
    });

    return c.json({
      success: true,
      data: {
        transactionId: txn.transactionId,
        checkoutUrl: txn.checkoutUrl,
        isMock: txn.isMock
      }
    });
  }

  // Sandbox / direct top-up simulation for testing
  const txId = crypto.randomUUID().replace(/-/g, '').toLowerCase();
  const updateWalletStmt = c.env.DB.prepare(`
    UPDATE wallets 
    SET balance = balance + ?, updated_at = datetime('now')
    WHERE id = ?
  `).bind(amount, wallet.id);

  const insertTxStmt = c.env.DB.prepare(`
    INSERT INTO wallet_transactions (id, wallet_id, amount, fee_deducted, type, status, payment_provider, notes)
    VALUES (?, ?, ?, 0.00, 'DEPOSIT', 'COMPLETED', 'PADDLE_SANDBOX', 'Wallet top-up deposit')
  `).bind(txId, wallet.id, amount);

  await c.env.DB.batch([updateWalletStmt, insertTxStmt]);

  return c.json({
    success: true,
    data: {
      message: `Successfully deposited $${amount.toFixed(2)} USD to wallet balance`,
      newBalance: Number(wallet.balance) + amount
    }
  });
});

// -------------------------------------------------------------
// REQUEST PAYOUT / WITHDRAWAL (CARRIERS)
// -------------------------------------------------------------
const withdrawSchema = z.object({
  amount: z.number().positive(),
  payoutMethod: z.enum(['BANK_ACH', 'PAYPAL', 'STRIPE_CONNECT', 'WIRE']).default('BANK_ACH'),
  accountDetails: z.string().min(3)
});

router.post('/withdraw', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const parseResult = withdrawSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid withdrawal details' } }, 400);
  }

  const { amount, payoutMethod, accountDetails } = parseResult.data;
  const wallet = await getOrCreateWallet(c.env.DB, user.id);

  if (Number(wallet.balance) < amount) {
    return c.json({
      success: false,
      error: { code: 'INSUFFICIENT_FUNDS', message: `Available balance ($${Number(wallet.balance).toFixed(2)}) is less than requested withdrawal amount ($${amount.toFixed(2)})` }
    }, 400);
  }

  const txId = crypto.randomUUID().replace(/-/g, '').toLowerCase();

  const updateWalletStmt = c.env.DB.prepare(`
    UPDATE wallets 
    SET balance = balance - ?, updated_at = datetime('now')
    WHERE id = ? AND balance >= ?
  `).bind(amount, wallet.id, amount);

  const insertTxStmt = c.env.DB.prepare(`
    INSERT INTO wallet_transactions (id, wallet_id, amount, fee_deducted, type, status, payment_provider, notes)
    VALUES (?, ?, ?, 0.00, 'PAYOUT_WITHDRAWAL', 'COMPLETED', ?, ?)
  `).bind(txId, wallet.id, amount, payoutMethod, `Withdrawal to ${accountDetails}`);

  await c.env.DB.batch([updateWalletStmt, insertTxStmt]);

  return c.json({
    success: true,
    data: {
      message: `Payout of $${amount.toFixed(2)} USD initiated successfully via ${payoutMethod}`,
      remainingBalance: Number(wallet.balance) - amount
    }
  });
});

// -------------------------------------------------------------
// ESCROW LOCK (SHIPPER / BROKER LOCKS FUNDS FOR A LOAD)
// -------------------------------------------------------------
router.post('/escrow/lock', async (c) => {
  const user = c.get('user');
  const { loadId } = await c.req.json();

  if (!loadId) {
    return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Missing loadId' } }, 400);
  }

  const load = await c.env.DB.prepare('SELECT * FROM loads WHERE id = ?').bind(loadId).first<any>();
  if (!load) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Load not found' } }, 404);
  }

  if (load.owner_user_id !== user.id && user.role !== 'ADMIN') {
    return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized for this load' } }, 403);
  }

  const wallet = await getOrCreateWallet(c.env.DB, user.id);
  const loadRate = Number(load.rate || 0);

  // Check if user has sufficient available balance
  if (Number(wallet.balance) < loadRate) {
    return c.json({
      success: false,
      error: {
        code: 'INSUFFICIENT_FUNDS',
        message: `Insufficient balance ($${Number(wallet.balance).toFixed(2)}) to lock escrow of $${loadRate.toFixed(2)}. Please add funds.`,
        requiredAmount: loadRate,
        availableBalance: Number(wallet.balance)
      }
    }, 400);
  }

  const txId = crypto.randomUUID().replace(/-/g, '').toLowerCase();

  const updateWalletStmt = c.env.DB.prepare(`
    UPDATE wallets 
    SET balance = balance - ?, escrow_balance = escrow_balance + ?, updated_at = datetime('now')
    WHERE id = ? AND balance >= ?
  `).bind(loadRate, loadRate, wallet.id, loadRate);

  const insertTxStmt = c.env.DB.prepare(`
    INSERT INTO wallet_transactions (id, wallet_id, load_id, amount, fee_deducted, type, status, payment_provider, notes)
    VALUES (?, ?, ?, ?, 0.00, 'ESCROW_LOCK', 'COMPLETED', 'WALLET', ?)
  `).bind(txId, wallet.id, loadId, loadRate, `Freight funds held in escrow for load ${load.reference_number}`);

  const eventStmt = c.env.DB.prepare(`
    INSERT INTO load_events (id, load_id, actor_id, event_type, notes)
    VALUES (?, ?, ?, 'ESCROW_FUNDED', 'Shipper locked freight funds into platform escrow')
  `).bind(crypto.randomUUID().replace(/-/g, '').toLowerCase(), loadId, user.id);

  await c.env.DB.batch([updateWalletStmt, insertTxStmt, eventStmt]);

  return c.json({
    success: true,
    data: {
      message: `Held $${loadRate.toFixed(2)} in Platform Escrow for Load ${load.reference_number}`,
      escrowBalance: Number(wallet.escrow_balance) + loadRate
    }
  });
});

// -------------------------------------------------------------
// ESCROW SETTLEMENT & RELEASE (UPON DELIVERY CONFIRMATION)
// -------------------------------------------------------------
router.post('/escrow/release', async (c) => {
  const user = c.get('user');
  const { loadId } = await c.req.json();

  if (!loadId) {
    return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Missing loadId' } }, 400);
  }

  const load = await c.env.DB.prepare('SELECT * FROM loads WHERE id = ?').bind(loadId).first<any>();
  if (!load) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Load not found' } }, 404);
  }

  // Authorization: Owner, Carrier assigned, or Admin
  const isOwner = load.owner_user_id === user.id;
  const isCarrier = load.assigned_carrier_id === user.id;
  const isAdmin = user.role === 'ADMIN';

  if (!isOwner && !isCarrier && !isAdmin) {
    return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized for this load' } }, 403);
  }

  if (!load.assigned_carrier_id) {
    return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'No carrier assigned to settle payment with' } }, 400);
  }

  // Get Shipper & Carrier wallets
  const shipperWallet = await getOrCreateWallet(c.env.DB, load.owner_user_id);
  const carrierWallet = await getOrCreateWallet(c.env.DB, load.assigned_carrier_id);

  // Get platform settings for fee percentage
  const settings = await SettingsService.getPlatformSettings(c.env.DB);
  const feePercent = settings.platform_fee_percent || 7.5;

  const loadAmount = Number(load.rate || 0);
  const platformFee = Math.round((loadAmount * (feePercent / 100)) * 100) / 100;
  const netPayout = Math.round((loadAmount - platformFee) * 100) / 100;

  const stmts: D1PreparedStatement[] = [];

  // 1. Deduct from Shipper escrow balance (if escrow was locked, or allow direct settlement)
  stmts.push(
    c.env.DB.prepare(`
      UPDATE wallets 
      SET escrow_balance = MAX(0, escrow_balance - ?), updated_at = datetime('now')
      WHERE id = ?
    `).bind(loadAmount, shipperWallet.id)
  );

  // 2. Credit Carrier available balance
  stmts.push(
    c.env.DB.prepare(`
      UPDATE wallets 
      SET balance = balance + ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(netPayout, carrierWallet.id)
  );

  // 3. Ledger: Shipper Escrow Release entry
  stmts.push(
    c.env.DB.prepare(`
      INSERT INTO wallet_transactions (id, wallet_id, load_id, amount, fee_deducted, type, status, payment_provider, notes)
      VALUES (?, ?, ?, ?, 0.00, 'ESCROW_RELEASE', 'COMPLETED', 'PLATFORM', ?)
    `).bind(
      crypto.randomUUID().replace(/-/g, '').toLowerCase(),
      shipperWallet.id,
      loadId,
      loadAmount,
      `Freight escrow released for load ${load.reference_number}`
    )
  );

  // 4. Ledger: Carrier Payout Credit entry
  stmts.push(
    c.env.DB.prepare(`
      INSERT INTO wallet_transactions (id, wallet_id, load_id, amount, fee_deducted, type, status, payment_provider, notes)
      VALUES (?, ?, ?, ?, ?, 'ESCROW_RELEASE', 'COMPLETED', 'PLATFORM', ?)
    `).bind(
      crypto.randomUUID().replace(/-/g, '').toLowerCase(),
      carrierWallet.id,
      loadId,
      netPayout,
      platformFee,
      `Net carrier payout for load ${load.reference_number} (${feePercent}% fee deducted)`
    )
  );

  // 5. Ledger: Platform Commission entry
  stmts.push(
    c.env.DB.prepare(`
      INSERT INTO wallet_transactions (id, wallet_id, load_id, amount, fee_deducted, type, status, payment_provider, notes)
      VALUES (?, ?, ?, ?, ?, 'PLATFORM_FEE', 'COMPLETED', 'PLATFORM', ?)
    `).bind(
      crypto.randomUUID().replace(/-/g, '').toLowerCase(),
      carrierWallet.id,
      loadId,
      platformFee,
      platformFee,
      `Doxhaul Platform commission (${feePercent}%) for load ${load.reference_number}`
    )
  );

  // 6. Update load status to SETTLED
  stmts.push(
    c.env.DB.prepare(`
      UPDATE loads 
      SET status = 'SETTLED', updated_at = datetime('now')
      WHERE id = ?
    `).bind(loadId)
  );

  // 7. Add load event
  stmts.push(
    c.env.DB.prepare(`
      INSERT INTO load_events (id, load_id, actor_id, event_type, from_status, to_status, notes)
      VALUES (?, ?, ?, 'PAYMENT_SETTLED', ?, 'SETTLED', ?)
    `).bind(
      crypto.randomUUID().replace(/-/g, '').toLowerCase(),
      loadId,
      user.id,
      load.status,
      `Platform escrow settled. Net carrier payout: $${netPayout.toFixed(2)}, Platform fee: $${platformFee.toFixed(2)}`
    )
  );

  await c.env.DB.batch(stmts);

  return c.json({
    success: true,
    data: {
      message: `Load ${load.reference_number} settled successfully`,
      loadAmount,
      platformFee,
      netPayout,
      status: 'SETTLED'
    }
  });
});

// -------------------------------------------------------------
// ROLE ONBOARDING CHECKOUT / SIMULATED PAYMENT
// -------------------------------------------------------------
router.post('/onboarding/checkout', async (c) => {
  const user = c.get('user');
  const settings = await SettingsService.getPlatformSettings(c.env.DB);

  let fee = 0;
  if (user.role === 'CARRIER') fee = settings.carrier_onboarding_fee;
  else if (user.role === 'BROKER') fee = settings.broker_onboarding_fee;
  else if (user.role === 'SHIPPER') fee = settings.shipper_onboarding_fee;

  const body = await c.req.json().catch(() => ({}));
  const isSimulated = body.simulated === true || !settings.paddle_api_key;

  if (isSimulated || fee === 0) {
    // Complete onboarding immediately
    await c.env.DB.prepare(`UPDATE users SET onboarding_paid = 1, updated_at = datetime('now') WHERE id = ?`).bind(user.id).run();

    const wallet = await getOrCreateWallet(c.env.DB, user.id);
    if (fee > 0) {
      await c.env.DB.prepare(`
        INSERT INTO wallet_transactions (id, wallet_id, amount, fee_deducted, type, status, payment_provider, notes)
        VALUES (?, ?, ?, 0.00, 'ONBOARDING_FEE', 'COMPLETED', 'PADDLE_SANDBOX', ?)
      `).bind(
        crypto.randomUUID().replace(/-/g, '').toLowerCase(),
        wallet.id,
        fee,
        `${user.role} registration onboarding fee paid`
      ).run();
    }

    return c.json({
      success: true,
      data: {
        paid: true,
        message: 'Onboarding completed successfully',
        role: user.role,
        fee
      }
    });
  }

  // Create real Paddle transaction for onboarding
  const txn = await PaddleService.createTransaction(settings, {
    amount: fee,
    customerEmail: user.email,
    description: `Doxhaul ${user.role} Onboarding & Compliance Fee`,
    customData: {
      type: 'ONBOARDING_FEE',
      userId: user.id,
      role: user.role,
      amount: fee
    }
  });

  return c.json({
    success: true,
    data: {
      paid: false,
      transactionId: txn.transactionId,
      checkoutUrl: txn.checkoutUrl,
      fee,
      role: user.role
    }
  });
});

export default router;
