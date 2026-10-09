import { Hono } from 'hono';
import { Env } from '../types/env';
import { optionalAuthMiddleware, JwtPayload } from '../middleware/auth';

const router = new Hono<{ Bindings: Env; Variables: { user?: JwtPayload } }>();

router.use('*', optionalAuthMiddleware);

const SUPPORT_SYSTEM_PROMPT = `You are Doxhaul Support AI. Assist shippers, brokers, and carriers with tracking, rate settlements, e-BOL filing, and compliance. Provide concise, professional, and actionable freight guidance.`;

/**
 * Support AI Chat Assistant
 * Powered by Cloudflare Workers AI (@cf/meta/llama-3.1-8b-instruct)
 * Automatically escalates to D1 support_tickets if human assistance is requested.
 */
router.post('/ai-chat', async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json().catch(() => ({}));
    const userMessage = (body.message || body.prompt || '').trim();
    const userRole = body.role || user?.role || 'User';
    const userEmail = body.email || user?.email || 'support-guest@doxhaul.com';

    if (!userMessage) {
      return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Message is required' } }, 400);
    }

    let reply = '';
    let escalatedToHuman = false;
    let createdTicketId: string | null = null;

    // Check for human escalation intent
    const escalationKeywords = /\b(human|agent|representative|manager|dispute|escalate|lawyer|stolen|fraud|urgent help|talk to a person)\b/i;
    const wantsHuman = escalationKeywords.test(userMessage);

    // 1. Query Cloudflare Workers AI (@cf/meta/llama-3.1-8b-instruct)
    if (c.env.AI && typeof c.env.AI.run === 'function') {
      try {
        const response: any = await c.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [
            { role: 'system', content: SUPPORT_SYSTEM_PROMPT },
            { role: 'user', content: `[User Role: ${userRole}] ${userMessage}` }
          ],
          max_tokens: 400,
          temperature: 0.6
        });

        if (response) {
          reply = typeof response === 'string' ? response : (response.response || JSON.stringify(response));
        }
      } catch (aiErr) {
        console.warn('Workers AI llama-3.1 error, using fallback logistics responder:', aiErr);
      }
    }

    // 2. Intelligent Rule-Based Fallback
    if (!reply) {
      const lower = userMessage.toLowerCase();
      if (lower.includes('license') || lower.includes('pending') || lower.includes('verification') || lower.includes('document')) {
        reply = "Compliance documents undergo immediate automated Gemini AI pre-screening upon upload. Our operations team validates Driver Licenses and COI insurance ($1M auto / $250k cargo) within 1-24 hours. Ensure uploaded photos are clear and unexpired.";
      } else if (lower.includes('tracking') || lower.includes('gps') || lower.includes('telematics') || lower.includes('samsara')) {
        reply = "Live ELD truck telematics are securely scoped to contracted shippers and carriers. Real-time GPS coordinates, vehicle speed, reefer temps, and 500m geofence events update continuously on your Load Tracking page.";
      } else if (lower.includes('bol') || lower.includes('pod') || lower.includes('deliver') || lower.includes('escrow')) {
        reply = "When a haul is completed, the carrier clicks 'Delivered' and uploads the signed Bill of Lading (e-BOL) and Proof of Delivery (POD). Gemini AI audits receiver signatures and carrier names before platform escrow is released.";
      } else if (lower.includes('fee') || lower.includes('commission') || lower.includes('onboarding') || lower.includes('rate')) {
        reply = "Platform commission and role onboarding fees are managed dynamically via Admin settings. Once a load is completed, net funds are settled directly into carrier wallets with zero hidden deductions.";
      } else {
        reply = "Hello! I am your Doxhaul AI Logistics Assistant. I can help with load tracking, rate settlements, compliance verification, and e-BOL filing. How can I assist your shipment today?";
      }
    }

    // 3. Human Escalation Ticket Creation
    if (wantsHuman) {
      escalatedToHuman = true;
      createdTicketId = `tkt_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
      
      try {
        await c.env.DB.prepare(`
          INSERT INTO support_tickets (
            id, user_id, email, category, subject, message, status, created_at, updated_at
          ) VALUES (?, ?, ?, 'PLATFORM_INQUIRY', ?, ?, 'OPEN', datetime('now'), datetime('now'))
        `).bind(
          createdTicketId,
          user?.id || null,
          userEmail,
          `Escalated AI Support Request: ${userMessage.slice(0, 50)}...`,
          `User Message: "${userMessage}"\n\nAI Reply Provided: "${reply}"`
        ).run();

        reply += `\n\n[Doxhaul Support Ticket #${createdTicketId.toUpperCase()} created. A logistics operations specialist has been notified and will review your request shortly.]`;
      } catch (ticketErr) {
        console.warn('Ticket auto-creation warning:', ticketErr);
      }
    }

    return c.json({
      success: true,
      data: {
        reply: reply.trim(),
        escalatedToHuman,
        ticketId: createdTicketId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err: any) {
    console.error('Support AI endpoint error:', err);
    return c.json({
      success: true,
      data: {
        reply: "Thank you for reaching out to Doxhaul Support. Our compliance and dispatch team is available 24/7. Please feel free to open a ticket directly for escalated assistance.",
        timestamp: new Date().toISOString()
      }
    });
  }
});

router.post('/chat', async (c) => {
  return router.fetch(new Request(new URL('/ai-chat', c.req.url).toString(), {
    method: 'POST',
    headers: c.req.raw.headers,
    body: await c.req.raw.clone().blob()
  }), c.env, c.executionCtx);
});

export default router;
