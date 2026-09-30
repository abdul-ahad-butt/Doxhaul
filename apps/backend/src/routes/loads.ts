import { Hono } from 'hono';
import { Env } from '../types/env';
import { authMiddleware, JwtPayload, requireRole, requireVerified } from '../middleware/auth';
import { createLoadSchema } from '../validators/loads';
import { calculateDistance } from '../services/distance';

const router = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

router.use('*', authMiddleware);

router.post('/', requireRole(['SHIPPER', 'BROKER']), requireVerified, async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  
  const parseResult = createLoadSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: parseResult.error.errors } }, 400);
  }

  const data = parseResult.data;

  // Generate Reference Number
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const referenceNumber = `FL-${timestamp}-${random}`;

  const loadId = crypto.randomUUID().replace(/-/g, '').toLowerCase();

  // Get company name
  const profile = await c.env.DB.prepare('SELECT company_name FROM profiles WHERE user_id = ?').bind(user.id).first<{company_name: string}>();
  const companyName = profile?.company_name || 'Unknown Company';

  // Calculate distance
  let mileage = null;
  let ratePerMile = null;
  if (data.originZip && data.destinationZip) {
    mileage = await calculateDistance(data.originZip, data.destinationZip);
    if (mileage > 0) {
      ratePerMile = data.rate / mileage;
    }
  }

  try {
    const result = await c.env.DB.prepare(`
      INSERT INTO loads (
        id, owner_user_id, owner_company_name, reference_number, title, description,
        origin_city, origin_state, origin_zip, origin_country,
        destination_city, destination_state, destination_zip, destination_country,
        pickup_date, delivery_date, mileage, rate_per_mile, equipment_type, weight, weight_unit,
        length, width, height, commodity, rate, currency, rate_type,
        special_instructions, status
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?
      ) RETURNING *
    `).bind(
      loadId, user.id, companyName, referenceNumber, data.title, data.description || null,
      data.originCity, data.originState, data.originZip || null, data.originCountry,
      data.destinationCity, data.destinationState, data.destinationZip || null, data.destinationCountry,
      data.pickupDate, data.deliveryDate, mileage, ratePerMile, data.equipmentType, data.weight, data.weightUnit,
      data.length || null, data.width || null, data.height || null, data.commodity || null, data.rate, data.currency, data.rateType,
      data.specialInstructions || null, 'OPEN'
    ).first();

    await c.env.DB.prepare(`
      INSERT INTO load_events (id, load_id, actor_id, event_type, to_status)
      VALUES (?, ?, ?, ?, ?)
    `).bind(crypto.randomUUID().replace(/-/g, '').toLowerCase(), loadId, user.id, 'LOAD_CREATED', 'OPEN').run();

    return c.json({ success: true, data: result }, 201);
  } catch (error: any) {
    console.error('Create load error:', error);
    return c.json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create load' } }, 500);
  }
});

router.get('/', async (c) => {
  const user = c.get('user');
  
  // Parse query params for filtering
  const origin = c.req.query('origin');
  const destination = c.req.query('destination');
  const equipment = c.req.query('equipment');
  const minRate = c.req.query('minRate');
  const status = c.req.query('status');
  const ownerOnly = c.req.query('ownerOnly') === 'true'; // For shippers/brokers to view their own loads
  
  const page = parseInt(c.req.query('page') || '1');
  const pageSize = parseInt(c.req.query('pageSize') || '20');
  const offset = (page - 1) * pageSize;

  let query = 'SELECT * FROM loads WHERE is_deleted = 0';
  const values: any[] = [];

  if (ownerOnly && (user.role === 'SHIPPER' || user.role === 'BROKER')) {
    query += ' AND owner_user_id = ?';
    values.push(user.id);
  } else if (user.role === 'CARRIER') {
    // Carriers mostly see OPEN loads unless filtering specific status for their booked loads
    if (!status) {
      query += ' AND status = ?';
      values.push('OPEN');
    }
  }

  if (origin) {
    query += ' AND (origin_city LIKE ? OR origin_state LIKE ?)';
    values.push(`%${origin}%`, `%${origin}%`);
  }
  if (destination) {
    query += ' AND (destination_city LIKE ? OR destination_state LIKE ?)';
    values.push(`%${destination}%`, `%${destination}%`);
  }
  if (equipment) {
    query += ' AND equipment_type = ?';
    values.push(equipment);
  }
  if (minRate) {
    query += ' AND rate >= ?';
    values.push(parseFloat(minRate));
  }
  if (status) {
    query += ' AND status = ?';
    values.push(status);
  }

  // Count total for pagination
  const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
  const totalResult = await c.env.DB.prepare(countQuery).bind(...values).first<{total: number}>();
  const total = totalResult?.total || 0;

  // Add order, limit, offset
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  values.push(pageSize, offset);

  const results = await c.env.DB.prepare(query).bind(...values).all();

  return c.json({ 
    success: true, 
    data: {
      items: results.results,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  });
});

router.get('/:id', async (c) => {
  const loadId = c.req.param('id');
  const user = c.get('user');

  const load = await c.env.DB.prepare('SELECT * FROM loads WHERE id = ? AND is_deleted = 0').bind(loadId).first();
  
  if (!load) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Load not found' } }, 404);
  }

  // Fetch carrier profile if assigned
  let carrier = null;
  if (load.assigned_carrier_id) {
    carrier = await c.env.DB.prepare('SELECT p.company_name, p.phone, p.first_name, p.last_name FROM profiles p WHERE user_id = ?').bind(load.assigned_carrier_id).first();
  }

  // Fetch load events
  const events = await c.env.DB.prepare(`
    SELECT le.*, p.first_name, p.last_name, p.company_name 
    FROM load_events le
    LEFT JOIN profiles p ON le.actor_id = p.user_id
    WHERE le.load_id = ? 
    ORDER BY le.created_at DESC
  `).bind(loadId).all();

  return c.json({ success: true, data: { ...load, carrier, events: events.results } });
});

router.put('/:id', requireRole(['SHIPPER', 'BROKER']), async (c) => {
  const loadId = c.req.param('id');
  const user = c.get('user');
  const body = await c.req.json();

  const load = await c.env.DB.prepare('SELECT * FROM loads WHERE id = ?').bind(loadId).first();
  
  if (!load) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Load not found' } }, 404);
  }

  if (load.owner_user_id !== user.id) {
    return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to edit this load' } }, 403);
  }

  if (load.status !== 'OPEN') {
    return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Cannot edit a load that is no longer OPEN' } }, 400);
  }

  // Using safeParse on the create schema as update (omitting full partial logic for brevity, but should only update allowed fields)
  // Real implementation might use a separate update schema.
  
  const parseResult = createLoadSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: parseResult.error.errors } }, 400);
  }

  const data = parseResult.data;

  try {
    const result = await c.env.DB.prepare(`
      UPDATE loads SET 
        title = ?, description = ?,
        origin_city = ?, origin_state = ?, origin_zip = ?, origin_country = ?,
        destination_city = ?, destination_state = ?, destination_zip = ?, destination_country = ?,
        pickup_date = ?, delivery_date = ?, equipment_type = ?, weight = ?, weight_unit = ?,
        length = ?, width = ?, height = ?, commodity = ?, rate = ?, currency = ?, rate_type = ?,
        special_instructions = ?, updated_at = datetime('now')
      WHERE id = ? AND owner_user_id = ? RETURNING *
    `).bind(
      data.title, data.description || null,
      data.originCity, data.originState, data.originZip || null, data.originCountry,
      data.destinationCity, data.destinationState, data.destinationZip || null, data.destinationCountry,
      data.pickupDate, data.deliveryDate, data.equipmentType, data.weight, data.weightUnit,
      data.length || null, data.width || null, data.height || null, data.commodity || null, data.rate, data.currency, data.rateType,
      data.specialInstructions || null, loadId, user.id
    ).first();

    return c.json({ success: true, data: result });
  } catch (error) {
    return c.json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update load' } }, 500);
  }
});

router.delete('/:id', requireRole(['SHIPPER', 'BROKER']), async (c) => {
  const loadId = c.req.param('id');
  const user = c.get('user');

  const load = await c.env.DB.prepare('SELECT * FROM loads WHERE id = ?').bind(loadId).first();
  
  if (!load) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Load not found' } }, 404);
  }

  if (load.owner_user_id !== user.id) {
    return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to delete this load' } }, 403);
  }

  if (load.status !== 'OPEN') {
    return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Cannot delete a load that is no longer OPEN' } }, 400);
  }

  // Soft delete
  await c.env.DB.prepare(`
    UPDATE loads SET is_deleted = 1, deleted_at = datetime('now'), deleted_by = ? WHERE id = ?
  `).bind(user.id, loadId).run();

  await c.env.DB.prepare(`
    INSERT INTO load_events (id, load_id, actor_id, event_type, notes)
    VALUES (?, ?, ?, ?, ?)
  `).bind(crypto.randomUUID().replace(/-/g, '').toLowerCase(), loadId, user.id, 'LOAD_DELETED', 'Load deleted by owner').run();

  return c.json({ success: true, data: { message: 'Load deleted successfully' } });
});

export default router;
