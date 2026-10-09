import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { Env } from '../types/env';
import { SettingsService } from '../services/settings';
import { JwtPayload } from '../middleware/auth';

const router = new Hono<{ Bindings: Env }>();

/**
 * Helper to ensure a wallet exists for a user
 */
async function getOrCreateWallet(db: D1Database, userId: string) {
  let wallet = await db.prepare('SELECT id, balance, escrow_balance FROM wallets WHERE user_id = ?')
    .bind(userId)
    .first<{ id: string, balance: number, escrow_balance: number }>();

  if (!wallet) {
    const walletId = crypto.randomUUID().replace(/-/g, '').toLowerCase();
    await db.prepare(`
      INSERT INTO wallets (id, user_id, balance, escrow_balance, currency)
      VALUES (?, ?, 0.00, 0.00, 'USD')
    `).bind(walletId, userId).run();

    wallet = { id: walletId, balance: 0.00, escrow_balance: 0.00 };
  }

  return wallet;
}

/**
 * GET /api/onboarding/status?email=...&userId=...
 * Returns user onboarding status and required fee
 */
router.get('/status', async (c) => {
  const email = c.req.query('email');
  const userId = c.req.query('userId') || c.req.query('id');

  if (!email && !userId) {
    return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Email or User ID required' } }, 400);
  }

  const user = await c.env.DB.prepare(`
    SELECT id, email, role, status, 
      COALESCE(onboarding_payment_status, 'ACTIVE') as onboarding_payment_status,
      COALESCE(onboarding_paid, 0) as onboarding_paid,
      COALESCE(onboarding_fee_paid, 0) as onboarding_fee_paid
    FROM users 
    WHERE email = ? OR id = ?
  `).bind((email || '').toLowerCase(), userId || '').first<any>();

  if (!user) {
    return c.json({ success: false, error: { code: 'USER_NOT_FOUND', message: 'User not found' } }, 404);
  }

  const settings = await SettingsService.getPlatformSettings(c.env.DB);
  let fee = 0;
  if (user.role === 'CARRIER') fee = settings.carrier_onboarding_fee;
  else if (user.role === 'BROKER') fee = settings.broker_onboarding_fee;
  else if (user.role === 'SHIPPER') fee = settings.shipper_onboarding_fee;

  return c.json({
    success: true,
    data: {
      userId: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      onboarding_payment_status: user.onboarding_payment_status,
      onboarding_paid: Number(user.onboarding_paid || 0),
      onboarding_fee_paid: Number(user.onboarding_fee_paid || 0),
      requiredFee: fee,
      isPendingPayment: user.onboarding_payment_status === 'PENDING_PAYMENT'
    }
  });
});

/**
 * POST /api/onboarding/simulate-payment
 * Confirms payment for user, unlocks account, and logs transaction
 */
router.post('/simulate-payment', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const email = body.email;
  const userId = body.userId || body.id;

  if (!email && !userId) {
    return c.json({
      success: false,
      error: { code: 'BAD_REQUEST', message: 'Email or User ID required to process onboarding payment' }
    }, 400);
  }

  const user = await c.env.DB.prepare(`
    SELECT id, email, role, status, 
      COALESCE(onboarding_payment_status, 'ACTIVE') as onboarding_payment_status,
      COALESCE(onboarding_paid, 0) as onboarding_paid
    FROM users 
    WHERE email = ? OR id = ?
  `).bind((email || '').toLowerCase(), userId || '').first<any>();

  if (!user) {
    return c.json({
      success: false,
      error: { code: 'USER_NOT_FOUND', message: 'User not found' }
    }, 404);
  }

  const settings = await SettingsService.getPlatformSettings(c.env.DB);
  let fee = 0;
  if (user.role === 'CARRIER') fee = settings.carrier_onboarding_fee;
  else if (user.role === 'BROKER') fee = settings.broker_onboarding_fee;
  else if (user.role === 'SHIPPER') fee = settings.shipper_onboarding_fee;

  // 1. Update user to ACTIVE payment status
  await c.env.DB.prepare(`
    UPDATE users 
    SET onboarding_payment_status = 'ACTIVE', 
        onboarding_paid = 1, 
        onboarding_fee_paid = ?, 
        updated_at = datetime('now') 
    WHERE id = ?
  `).bind(fee, user.id).run();

  // 2. Log in wallet ledger
  try {
    const wallet = await getOrCreateWallet(c.env.DB, user.id);
    if (fee > 0) {
      await c.env.DB.prepare(`
        INSERT INTO wallet_transactions (id, wallet_id, amount, fee_deducted, type, status, payment_provider, notes)
        VALUES (?, ?, ?, 0.00, 'ONBOARDING_FEE', 'COMPLETED', 'PADDLE_SANDBOX', ?)
      `).bind(
        crypto.randomUUID().replace(/-/g, '').toLowerCase(),
        wallet.id,
        fee,
        `${user.role} registration onboarding fee paid ($${fee})`
      ).run();
    }
  } catch (err) {
    console.warn('Wallet transaction logging failed, continuing:', err);
  }

  // 3. Issue JWT token so user can proceed directly into platform
  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
  };

  const token = await sign(payload, c.env.JWT_SECRET || 'fallback-secret-do-not-use-in-prod');

  return c.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        onboarding_payment_status: 'ACTIVE',
        onboarding_paid: 1,
        onboarding_fee_paid: fee
      },
      fee,
      message: 'Onboarding payment confirmed and credentials activated'
    }
  });
});

export default router;
