import { Hono } from 'hono';
import { Env } from '../types/env';
import { authMiddleware, JwtPayload } from '../middleware/auth';

const router = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

router.use('*', authMiddleware);

router.get('/stats', async (c) => {
  const user = c.get('user');

  try {
    const stats = (await c.env.DB.prepare(`
      SELECT 
        COUNT(CASE WHEN status IN ('OPEN', 'ASSIGNED', 'HEADING_TO_PICKUP', 'PICKED_UP', 'IN_TRANSIT') AND is_deleted = 0 THEN 1 END) AS active_loads,
        COUNT(CASE WHEN status = 'IN_TRANSIT' AND is_deleted = 0 THEN 1 END) AS in_transit,
        COUNT(CASE WHEN status = 'DELIVERED' AND is_deleted = 0 THEN 1 END) AS delivered,
        COALESCE(SUM(CASE WHEN status = 'DELIVERED' AND is_deleted = 0 THEN rate ELSE 0 END), 0) AS total_spend_revenue
      FROM loads 
      WHERE (owner_user_id = ? OR assigned_carrier_id = ?)
    `).bind(user.id, user.id).first()) as any;

    return c.json({
      success: true,
      data: {
        activeLoads: Number(stats?.active_loads || 0),
        inTransit: Number(stats?.in_transit || 0),
        delivered: Number(stats?.delivered || 0),
        totalSpendRevenue: Number(stats?.total_spend_revenue || 0)
      }
    });
  } catch (err: any) {
    console.error('Error fetching dashboard stats:', err);
    return c.json({
      success: true,
      data: {
        activeLoads: 0,
        inTransit: 0,
        delivered: 0,
        totalSpendRevenue: 0
      }
    });
  }
});

router.get('/activity', async (c) => {
  const user = c.get('user');

  try {
    // 1. Query load events for user's loads
    const loadEvents = await c.env.DB.prepare(`
      SELECT 
        le.id,
        l.reference_number,
        le.event_type,
        le.from_status,
        le.to_status,
        le.notes,
        le.created_at
      FROM load_events le
      JOIN loads l ON le.load_id = l.id
      WHERE l.owner_user_id = ? OR l.assigned_carrier_id = ?
      ORDER BY le.created_at DESC
      LIMIT 10
    `).bind(user.id, user.id).all();

    if (loadEvents.results && loadEvents.results.length > 0) {
      return c.json({
        success: true,
        data: loadEvents.results.map((e: any) => ({
          id: e.id,
          title: `Load ${e.reference_number} status updated`,
          description: `Status changed ${e.from_status ? `from ${e.from_status} ` : ''}to ${e.to_status}`,
          timestamp: e.created_at
        }))
      });
    }

    // 2. Fallback to audit logs if no load events
    const audits = await c.env.DB.prepare(`
      SELECT id, action, entity_type, entity_id, created_at
      FROM audit_logs
      WHERE actor_id = ? OR entity_id = ?
      ORDER BY created_at DESC
      LIMIT 10
    `).bind(user.id, user.id).all();

    const formattedAudits = (audits.results || []).map((a: any) => ({
      id: a.id,
      title: a.action.replace(/_/g, ' '),
      description: `${a.entity_type} ${a.entity_id || ''}`.trim(),
      timestamp: a.created_at
    }));

    return c.json({
      success: true,
      data: formattedAudits
    });
  } catch (err: any) {
    console.error('Error fetching dashboard activity:', err);
    return c.json({
      success: true,
      data: []
    });
  }
});

export default router;
