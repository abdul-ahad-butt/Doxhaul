import { Hono } from 'hono';
import { Env } from '../types/env';
import { SettingsService } from '../services/settings';

const router = new Hono<{ Bindings: Env }>();

/**
 * GET /api/platform/policies (Public)
 * Returns live financial policies: commission %, carrier onboarding fee, shipper fee, broker fee
 */
router.get('/policies', async (c) => {
  const policies = await SettingsService.getFinancialPolicies(c.env.DB);
  return c.json({
    success: true,
    data: policies,
    ...policies
  });
});

/**
 * GET /api/platform/settings (Public sanitized settings)
 */
router.get('/settings', async (c) => {
  const policies = await SettingsService.getFinancialPolicies(c.env.DB);
  return c.json({
    success: true,
    data: policies,
    ...policies
  });
});

export default router;
