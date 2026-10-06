import { Hono } from 'hono';
import { Env } from '../types/env';
import { SettingsService } from '../services/settings';
import { PaddleService } from '../services/paddle';

const router = new Hono<{ Bindings: Env }>();

// -------------------------------------------------------------
// PADDLE WEBHOOK HANDLER
// -------------------------------------------------------------
router.post('/paddle', async (c) => {
  const signatureHeader = c.req.header('Paddle-Signature');
  const rawBody = await c.req.text();
  const settings = await SettingsService.getPlatformSettings(c.env.DB);

  // Validate webhook signature if secret configured
  if (settings.paddle_webhook_secret) {
    const isValid = await PaddleService.verifyWebhookSignature(
      signatureHeader,
      rawBody,
      settings.paddle_webhook_secret
    );

    if (!isValid) {
      console.warn('Invalid Paddle webhook signature rejected');
      return c.json({ success: false, error: 'Invalid webhook signature' }, 401);
    }
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return c.json({ success: false, error: 'Invalid JSON payload' }, 400);
  }

  const eventType = event.event_type || event.alert_name;
  const eventData = event.data || event;
  const customData = eventData.custom_data || {};

  console.log(`Processing Paddle Webhook Event: ${eventType}`, { customData });

  // Handle transaction.completed / payment_succeeded
  if (
    eventType === 'transaction.completed' || 
    eventType === 'payment.succeeded' || 
    eventType === 'payment_succeeded'
  ) {
    const userId = customData.userId || customData.user_id;
    const paymentType = customData.type;

    if (paymentType === 'ONBOARDING_FEE' && userId) {
      // 1. Mark user onboarding paid
      await c.env.DB.prepare(`
        UPDATE users 
        SET onboarding_paid = 1, updated_at = datetime('now') 
        WHERE id = ?
      `).bind(userId).run();

      // Find user's wallet
      const wallet = await c.env.DB.prepare('SELECT id FROM wallets WHERE user_id = ?').bind(userId).first<any>();
      if (wallet) {
        const feeAmount = Number(customData.amount || 0);
        await c.env.DB.prepare(`
          INSERT INTO wallet_transactions (id, wallet_id, amount, fee_deducted, type, status, payment_provider, provider_transaction_id, notes)
          VALUES (?, ?, ?, 0.00, 'ONBOARDING_FEE', 'COMPLETED', 'PADDLE', ?, 'Onboarding fee paid via Paddle')
        `).bind(
          crypto.randomUUID().replace(/-/g, '').toLowerCase(),
          wallet.id,
          feeAmount,
          eventData.id || event.event_id || null
        ).run();
      }

      console.log(`User ${userId} onboarding marked as paid via Paddle.`);
    } else if (paymentType === 'WALLET_DEPOSIT' && userId) {
      // 2. Credit wallet balance
      const depositAmount = Number(customData.amount || (eventData.details?.totals?.total ? Number(eventData.details.totals.total) / 100 : 0));
      let wallet = await c.env.DB.prepare('SELECT id FROM wallets WHERE user_id = ?').bind(userId).first<any>();

      if (!wallet) {
        const newWalletId = crypto.randomUUID().replace(/-/g, '').toLowerCase();
        await c.env.DB.prepare(`
          INSERT INTO wallets (id, user_id, balance, escrow_balance, currency)
          VALUES (?, ?, ?, 0.00, 'USD')
        `).bind(newWalletId, userId, depositAmount).run();
        wallet = { id: newWalletId };
      } else {
        await c.env.DB.prepare(`
          UPDATE wallets 
          SET balance = balance + ?, updated_at = datetime('now') 
          WHERE id = ?
        `).bind(depositAmount, wallet.id).run();
      }

      await c.env.DB.prepare(`
        INSERT INTO wallet_transactions (id, wallet_id, amount, fee_deducted, type, status, payment_provider, provider_transaction_id, notes)
        VALUES (?, ?, ?, 0.00, 'DEPOSIT', 'COMPLETED', 'PADDLE', ?, 'Wallet top-up via Paddle')
      `).bind(
        crypto.randomUUID().replace(/-/g, '').toLowerCase(),
        wallet.id,
        depositAmount,
        eventData.id || event.event_id || null
      ).run();

      console.log(`User ${userId} wallet credited +$${depositAmount} via Paddle deposit.`);
    }
  }

  return c.json({ success: true, received: true });
});

// -------------------------------------------------------------
// PERSONA WEBHOOK HANDLER
// -------------------------------------------------------------
router.post('/persona', async (c) => {
  let event: any;
  try {
    event = await c.req.json();
  } catch {
    return c.json({ success: false, error: 'Invalid JSON payload' }, 400);
  }

  const eventName = event?.data?.attributes?.name || event?.event || '';
  const inquiryData = event?.data?.attributes?.payload?.data || event?.data || {};
  const inquiryStatus = inquiryData?.attributes?.status || '';
  const referenceId = inquiryData?.attributes?.referenceId || inquiryData?.attributes?.reference_id;

  console.log(`Processing Persona Webhook Event: ${eventName}`, { referenceId, inquiryStatus });

  if (referenceId) {
    const isPassed = 
      eventName === 'inquiry.completed' || 
      eventName === 'inquiry.approved' || 
      inquiryStatus === 'completed' || 
      inquiryStatus === 'approved';

    const isFailed = 
      eventName === 'inquiry.failed' || 
      eventName === 'inquiry.declined' || 
      inquiryStatus === 'failed' || 
      inquiryStatus === 'declined';

    if (isPassed) {
      // 1. Approve user verification
      await c.env.DB.prepare(`
        UPDATE users 
        SET verification_status = 'APPROVED', status = 'ACTIVE', updated_at = datetime('now') 
        WHERE id = ?
      `).bind(referenceId).run();

      // 2. Approve user profile
      await c.env.DB.prepare(`
        UPDATE profiles 
        SET verification_status = 'VERIFIED', updated_at = datetime('now') 
        WHERE user_id = ?
      `).bind(referenceId).run();

      // 3. Mark user documents approved
      await c.env.DB.prepare(`
        UPDATE documents 
        SET status = 'APPROVED', ai_verified = 1, ai_summary = 'Verified via Persona automated KYC' 
        WHERE user_id = ? AND status = 'PENDING'
      `).bind(referenceId).run();

      // 4. Log audit log
      await c.env.DB.prepare(`
        INSERT INTO audit_logs (id, actor_id, actor_role, action, entity_type, entity_id, metadata)
        VALUES (?, ?, 'SYSTEM', 'PERSONA_VERIFICATION_APPROVED', 'USER', ?, ?)
      `).bind(
        crypto.randomUUID().replace(/-/g, '').toLowerCase(),
        referenceId,
        referenceId,
        JSON.stringify({ eventName, inquiryId: inquiryData.id })
      ).run();

      console.log(`User ${referenceId} successfully verified via Persona.`);
    } else if (isFailed) {
      await c.env.DB.prepare(`
        UPDATE users 
        SET verification_status = 'REJECTED', updated_at = datetime('now') 
        WHERE id = ?
      `).bind(referenceId).run();

      await c.env.DB.prepare(`
        UPDATE profiles 
        SET verification_status = 'REJECTED', verification_notes = 'Failed Persona automated identity check', updated_at = datetime('now') 
        WHERE user_id = ?
      `).bind(referenceId).run();

      console.log(`User ${referenceId} marked REJECTED via Persona.`);
    }
  }

  return c.json({ success: true, processed: true });
});

export default router;
