import { Hono } from 'hono';
import { Env } from '../types/env';
import { authMiddleware, optionalAuthMiddleware, JwtPayload, requireRole, requireVerified } from '../middleware/auth';
import { createLoadSchema } from '../validators/loads';
import { calculateDistance } from '../services/distance';
import { handleSubmitBid, handleGetLoadBids } from './bids';

const router = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

router.use('*', optionalAuthMiddleware);

router.post('/', authMiddleware, requireRole(['SHIPPER', 'BROKER', 'ADMIN']), requireVerified, async (c) => {
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
  try {
    const user = c.get('user');
    
    // Parse query params for Doxhaul Marketplace filtering
    const origin = c.req.query('origin');
    const destination = c.req.query('destination');
    const anywhere = c.req.query('anywhere') === 'true' || c.req.query('anywhere') === '1';
    const equipment = c.req.query('equipment');
    const minRate = c.req.query('minRate');
    const minRpm = c.req.query('minRpm');
    const loadSize = c.req.query('loadSize');
    const pickupDate = c.req.query('pickupDate');
    const sort = c.req.query('sort') || 'NEWEST';
    const status = c.req.query('status');
    const q = c.req.query('q') || c.req.query('search');
    const ownerOnly = c.req.query('ownerOnly') === 'true'; // For shippers/brokers to view their own loads
    
    const page = parseInt(c.req.query('page') || '1');
    const pageSize = parseInt(c.req.query('pageSize') || '20');
    const offset = (page - 1) * pageSize;

    const selectClause = `SELECT loads.*, 
      (SELECT COUNT(*) FROM bids WHERE bids.load_id = loads.id AND bids.status = 'PENDING') as pending_bids_count,
      (SELECT COUNT(*) FROM bids WHERE bids.load_id = loads.id) as total_bids_count`;

    let query = `${selectClause} FROM loads WHERE is_deleted = 0`;
    const values: any[] = [];

    if (ownerOnly && user && (user.role === 'SHIPPER' || user.role === 'BROKER' || user.role === 'ADMIN')) {
      query += ' AND owner_user_id = ?';
      values.push(user.id);
    } else if (user?.role === 'CARRIER') {
      // Carriers see OPEN and BIDDING loads unless explicitly filtering
      if (!status) {
        query += ' AND (status = ? OR status = ?)';
        values.push('OPEN', 'BIDDING');
      }
    } else if (!user) {
      if (!status) {
        query += ' AND (status = ? OR status = ?)';
        values.push('OPEN', 'BIDDING');
      }
    }

  // Free text search fallback
  if (q && q.trim()) {
    const term = `%${q.trim()}%`;
    query += ' AND (origin_city LIKE ? OR origin_state LIKE ? OR destination_city LIKE ? OR destination_state LIKE ? OR title LIKE ? OR reference_number LIKE ?)';
    values.push(term, term, term, term, term, term);
  }

  // Origin filter
  if (origin && origin.trim()) {
    const o = `%${origin.trim()}%`;
    query += ' AND (origin_city LIKE ? OR origin_state LIKE ? OR origin_zip LIKE ?)';
    values.push(o, o, o);
  }

  // Destination filter (ignored if anywhere is true)
  if (!anywhere && destination && destination.trim()) {
    const d = `%${destination.trim()}%`;
    query += ' AND (destination_city LIKE ? OR destination_state LIKE ? OR destination_zip LIKE ?)';
    values.push(d, d, d);
  }

  // Multi-equipment filter
  if (equipment && equipment !== 'ALL') {
    const eqList = equipment
      .split(',')
      .map((e: string) => e.trim().toUpperCase())
      .filter((e: string) => Boolean(e) && e !== 'ALL');

    if (eqList.length === 1) {
      query += ' AND equipment_type = ?';
      values.push(eqList[0]);
    } else if (eqList.length > 1) {
      const placeholders = eqList.map(() => '?').join(', ');
      query += ` AND equipment_type IN (${placeholders})`;
      values.push(...eqList);
    }
  }

  // Min payout rate
  if (minRate) {
    const parsedRate = parseFloat(minRate);
    if (!isNaN(parsedRate) && parsedRate > 0) {
      query += ' AND rate >= ?';
      values.push(parsedRate);
    }
  }

  // Min rate per mile
  if (minRpm) {
    const parsedRpm = parseFloat(minRpm);
    if (!isNaN(parsedRpm) && parsedRpm > 0) {
      query += ' AND (rate_per_mile >= ? OR (mileage > 0 AND (rate / mileage) >= ?))';
      values.push(parsedRpm, parsedRpm);
    }
  }

  // Load size (FTL / LTL)
  if (loadSize === 'FTL') {
    query += ' AND (weight >= 15000 OR length >= 48)';
  } else if (loadSize === 'LTL') {
    query += ' AND weight < 15000';
  }

  // Pickup date filter
  if (pickupDate && pickupDate !== 'ALL') {
    if (pickupDate === 'TODAY') {
      query += " AND date(pickup_date) = date('now')";
    } else if (pickupDate === 'TOMORROW') {
      query += " AND date(pickup_date) = date('now', '+1 day')";
    } else if (pickupDate === 'NEXT_3_DAYS') {
      query += " AND date(pickup_date) >= date('now') AND date(pickup_date) <= date('now', '+3 days')";
    } else if (pickupDate === 'NEXT_7_DAYS') {
      query += " AND date(pickup_date) >= date('now') AND date(pickup_date) <= date('now', '+7 days')";
    }
  }

  if (status) {
    query += ' AND status = ?';
    values.push(status);
  }

  // Count total for pagination
  const countQuery = query.replace(selectClause, 'SELECT COUNT(*) as total');
  const totalResult = await c.env.DB.prepare(countQuery).bind(...values).first<{total: number}>();
  const total = totalResult?.total || 0;

  // Sorting
  let orderBy = 'created_at DESC';
  if (sort === 'HIGHEST_RATE') {
    orderBy = 'rate DESC';
  } else if (sort === 'RPM') {
    orderBy = 'COALESCE(rate_per_mile, rate / NULLIF(mileage, 0)) DESC';
  } else if (sort === 'EARLIEST_PICKUP') {
    orderBy = 'pickup_date ASC';
  } else if (sort === 'DEADHEAD') {
    orderBy = 'mileage ASC, created_at DESC';
  } else if (sort === 'NEWEST') {
    orderBy = 'created_at DESC';
  }

  query += ` ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
  values.push(pageSize, offset);

  const results = await c.env.DB.prepare(query).bind(...values).all();

    return c.json({ 
      success: true, 
      data: {
        items: results.results || [],
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error: any) {
    console.error('Failed to query freight loads:', error);
    return c.json({ 
      success: true, 
      data: {
        items: [],
        total: 0,
        page: 1,
        pageSize: 20,
        totalPages: 0
      }
    });
  }
});

router.get('/:id', async (c) => {
  const loadId = c.req.param('id');
  const user = c.get('user');

  try {
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
  } catch (error: any) {
    console.error('Failed to get load details:', error);
    return c.json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to retrieve load' } }, 500);
  }
});

router.put('/:id', authMiddleware, requireRole(['SHIPPER', 'BROKER']), async (c) => {
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

router.delete('/:id', authMiddleware, requireRole(['SHIPPER', 'BROKER']), async (c) => {
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

// Load Bidding endpoints
router.post('/:id/bids', authMiddleware, requireRole(['CARRIER', 'BROKER', 'ADMIN']), requireVerified, (c) => handleSubmitBid(c));
router.get('/:id/bids', (c) => handleGetLoadBids(c));

export default router;
