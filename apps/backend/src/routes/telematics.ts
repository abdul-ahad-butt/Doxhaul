import { Hono } from 'hono';
import { Env } from '../types/env';
import { authMiddleware, JwtPayload } from '../middleware/auth';
import {
  ensureTelematicsTables,
  calculateHaversineDistanceMeters,
  calculateBearingDegrees,
  resolveLocationCoordinates,
  checkGeofenceTrigger,
  parseSamsaraWebhook,
  parseMotiveWebhook,
  TelemetryPing
} from '../services/telematics';
import { z } from 'zod';

const router = new Hono<{ Bindings: Env; Variables: { user?: JwtPayload } }>();

// Validation Schemas
const pingSchema = z.object({
  loadId: z.string().min(1),
  carrierId: z.string().optional(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  speed: z.number().min(0).max(120).optional(),
  heading: z.number().min(0).max(360).optional(),
  temperature: z.number().optional(),
  hosStatus: z.enum(['OFF_DUTY', 'SLEEPER', 'DRIVING', 'ON_DUTY']).optional(),
  hosHoursRemaining: z.number().min(0).max(14).optional(),
  providerSource: z.string().optional()
});

const simulateSchema = z.object({
  step: z.number().min(0).optional(),
  totalSteps: z.number().min(1).max(500).optional(),
  forceGeofence: z.boolean().optional(),
  reset: z.boolean().optional()
});

const providerSchema = z.object({
  providerName: z.enum(['samsara', 'motive', 'project44', 'simulator']),
  apiKey: z.string().optional(),
  externalFleetId: z.string().optional(),
  vehicleUnitId: z.string().optional(),
  isActive: z.boolean().optional()
});

/**
 * 1. POST /api/telematics/ping
 * Ingest live vehicle telemetry coordinate, store in load_telemetry, and test geofence.
 */
router.post('/ping', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parseResult = pingSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: parseResult.error.message } }, 400);
  }

  const {
    loadId,
    lat,
    lng,
    speed = 62,
    heading = 0,
    temperature,
    hosStatus = 'DRIVING',
    hosHoursRemaining = 8.5,
    providerSource = 'telematics-ping'
  } = parseResult.data;

  await ensureTelematicsTables(c.env.DB);

  // Retrieve load details
  const load = (await c.env.DB.prepare(`
    SELECT id, assigned_carrier_id, origin_city, origin_state, destination_city, destination_state, equipment_type, status
    FROM loads WHERE id = ?
  `).bind(loadId).first()) as any;

  if (!load) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Load not found' } }, 404);
  }

  const carrierId = parseResult.data.carrierId || load.assigned_carrier_id || 'system-carrier';
  const pingId = crypto.randomUUID().replace(/-/g, '').toLowerCase();

  // Determine temperature default if Reefer
  const finalTemp = temperature !== undefined
    ? temperature
    : load.equipment_type === 'REEFER'
    ? -2.4 + (Math.sin(Date.now() / 10000) * 0.4)
    : undefined;

  // Insert telemetry ping
  await c.env.DB.prepare(`
    INSERT INTO load_telemetry (
      id, load_id, carrier_id, latitude, longitude, speed_mph, heading_degrees,
      temperature_fahrenheit, hos_status, hos_hours_remaining, provider_source, recorded_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).bind(
    pingId,
    loadId,
    carrierId,
    lat,
    lng,
    speed,
    heading,
    finalTemp ?? null,
    hosStatus,
    hosHoursRemaining,
    providerSource
  ).run();

  // Evaluate Geofencing
  const originCoords = resolveLocationCoordinates(load.origin_city, load.origin_state);
  const destCoords = resolveLocationCoordinates(load.destination_city, load.destination_state);
  const geofence = checkGeofenceTrigger(lat, lng, originCoords, destCoords, 500);

  let geofenceEventLogged = null;

  if (geofence.isTriggered && geofence.eventType) {
    // Check if event has already been recorded recently
    const existing = (await c.env.DB.prepare(`
      SELECT id FROM load_geofence_events WHERE load_id = ? AND event_type = ?
    `).bind(loadId, geofence.eventType).first()) as any;

    if (!existing) {
      const eventId = crypto.randomUUID().replace(/-/g, '').toLowerCase();
      await c.env.DB.prepare(`
        INSERT INTO load_geofence_events (id, load_id, event_type, distance_meters, latitude, longitude, triggered_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `).bind(eventId, loadId, geofence.eventType, geofence.distanceMeters, lat, lng).run();

      geofenceEventLogged = {
        id: eventId,
        eventType: geofence.eventType,
        distanceMeters: geofence.distanceMeters,
      };

      // Milestone transition: If entering destination, log prompt for e-POD upload
      if (geofence.eventType === 'ENTER_DESTINATION') {
        await c.env.DB.prepare(`
          INSERT INTO load_events (id, load_id, actor_id, event_type, from_status, to_status, notes)
          VALUES (?, ?, ?, 'GEOFENCE_TRIGGER', ?, 'ARRIVED_AT_DESTINATION', ?)
        `).bind(
          crypto.randomUUID().replace(/-/g, '').toLowerCase(),
          loadId,
          carrierId,
          load.status,
          `Automated geofence detected vehicle within ${geofence.distanceMeters}m of ${load.destination_city}. Prompting carrier for e-POD upload.`
        ).run().catch(() => {});
      }
    }
  }

  return c.json({
    success: true,
    data: {
      pingId,
      loadId,
      lat,
      lng,
      speedMph: speed,
      headingDegrees: heading,
      temperatureFahrenheit: finalTemp,
      hosStatus,
      hosHoursRemaining,
      geofence: {
        triggered: geofence.isTriggered,
        eventType: geofence.eventType,
        distanceMeters: geofence.distanceMeters,
        loggedEvent: geofenceEventLogged,
      },
    },
  });
});

/**
 * 2. GET /api/telematics/:loadId/live
 * Fetches latest GPS ping, current HOS, reefer temperature, and last 50 coordinates trail.
 */
router.get('/:loadId/live', async (c) => {
  const loadId = c.req.param('loadId');
  await ensureTelematicsTables(c.env.DB);

  // Fetch load metadata
  const load = (await c.env.DB.prepare(`
    SELECT id, reference_number, title, origin_city, origin_state, destination_city, destination_state,
           pickup_date, delivery_date, rate, equipment_type, status, assigned_carrier_id
    FROM loads WHERE id = ?
  `).bind(loadId).first()) as any;

  if (!load) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Load not found' } }, 404);
  }

  const originCoords = resolveLocationCoordinates(load.origin_city, load.origin_state);
  const destCoords = resolveLocationCoordinates(load.destination_city, load.destination_state);

  // Fetch recent breadcrumbs
  const breadcrumbs = (await c.env.DB.prepare(`
    SELECT id, latitude as lat, longitude as lng, speed_mph as speed, heading_degrees as heading,
           temperature_fahrenheit as temp, hos_status as hosStatus, hos_hours_remaining as hosHours,
           provider_source as providerSource, recorded_at as recordedAt
    FROM load_telemetry
    WHERE load_id = ?
    ORDER BY recorded_at DESC
    LIMIT 50
  `).bind(loadId).all()) as any;

  const records = breadcrumbs.results || [];
  let latestPing = records[0] || null;

  // If no live ping yet exists, construct initial coordinate at or near origin
  if (!latestPing) {
    const bearing = calculateBearingDegrees(originCoords.lat, originCoords.lng, destCoords.lat, destCoords.lng);
    latestPing = {
      id: 'initial',
      lat: originCoords.lat,
      lng: originCoords.lng,
      speed: 0,
      heading: bearing,
      temp: load.equipment_type === 'REEFER' ? -2.4 : 68.0,
      hosStatus: 'ON_DUTY',
      hosHours: 9.0,
      providerSource: 'simulated-initial',
      recordedAt: new Date().toISOString(),
    };
  }

  // Calculate real-time distances
  const distToDestMeters = calculateHaversineDistanceMeters(latestPing.lat, latestPing.lng, destCoords.lat, destCoords.lng);
  const totalCorridorMeters = calculateHaversineDistanceMeters(originCoords.lat, originCoords.lng, destCoords.lat, destCoords.lng);
  const progressPercent = Math.min(100, Math.max(0, Math.round(((totalCorridorMeters - distToDestMeters) / Math.max(1, totalCorridorMeters)) * 100)));

  // Estimate ETA based on speed (or standard 55 mph highway average)
  const currentSpeed = latestPing.speed > 10 ? latestPing.speed : 55;
  const milesRemaining = (distToDestMeters / 1609.34);
  const hoursRemaining = milesRemaining / currentSpeed;
  const etaMinutes = Math.round(hoursRemaining * 60);

  // Fetch geofence triggers
  const geofenceEvents = (await c.env.DB.prepare(`
    SELECT id, event_type as eventType, distance_meters as distanceMeters, triggered_at as triggeredAt
    FROM load_geofence_events
    WHERE load_id = ?
    ORDER BY triggered_at DESC
  `).bind(loadId).all()) as any;

  return c.json({
    success: true,
    data: {
      load: {
        id: load.id,
        referenceNumber: load.reference_number,
        title: load.title,
        status: load.status,
        equipmentType: load.equipment_type,
        rate: load.rate,
        origin: {
          city: load.origin_city,
          state: load.origin_state,
          coordinates: originCoords,
        },
        destination: {
          city: load.destination_city,
          state: load.destination_state,
          coordinates: destCoords,
        },
      },
      currentTelemetry: {
        lat: latestPing.lat,
        lng: latestPing.lng,
        speedMph: latestPing.speed,
        headingDegrees: latestPing.heading,
        temperatureFahrenheit: latestPing.temp,
        hosStatus: latestPing.hosStatus || 'DRIVING',
        hosHoursRemaining: latestPing.hosHours || 8.2,
        providerSource: latestPing.providerSource || 'simulator',
        recordedAt: latestPing.recordedAt,
      },
      corridorMetrics: {
        totalDistanceMiles: Math.round(totalCorridorMeters / 1609.34),
        milesRemaining: Math.round(milesRemaining * 10) / 10,
        distanceToDestinationMeters: distToDestMeters,
        progressPercent,
        estimatedEtaMinutes: etaMinutes,
        inDestinationGeofence: distToDestMeters <= 500,
      },
      breadcrumbs: records,
      geofenceEvents: geofenceEvents.results || [],
    },
  });
});

/**
 * 3. POST /api/telematics/simulate/:loadId
 * Advanced Corridor Simulator: Steps truck forward along highway corridor with realistic jitter, speed, and temperature.
 */
router.post('/simulate/:loadId', async (c) => {
  const loadId = c.req.param('loadId');
  const body = await c.req.json().catch(() => ({}));
  const parseResult = simulateSchema.safeParse(body);

  await ensureTelematicsTables(c.env.DB);

  const load = (await c.env.DB.prepare(`
    SELECT id, assigned_carrier_id, origin_city, origin_state, destination_city, destination_state, equipment_type
    FROM loads WHERE id = ?
  `).bind(loadId).first()) as any;

  if (!load) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Load not found' } }, 404);
  }

  const origin = resolveLocationCoordinates(load.origin_city, load.origin_state);
  const dest = resolveLocationCoordinates(load.destination_city, load.destination_state);

  // If reset requested, clear telemetry history for this load
  if (parseResult.success && parseResult.data.reset) {
    await c.env.DB.prepare('DELETE FROM load_telemetry WHERE load_id = ?').bind(loadId).run();
    await c.env.DB.prepare('DELETE FROM load_geofence_events WHERE load_id = ?').bind(loadId).run();
  }

  // Count existing telemetry steps to automatically determine forward progress
  const countRow = (await c.env.DB.prepare(`
    SELECT COUNT(*) as count FROM load_telemetry WHERE load_id = ?
  `).bind(loadId).first()) as any;

  const currentCount = Number(countRow?.count || 0);
  const totalSteps = parseResult.success && parseResult.data.totalSteps ? parseResult.data.totalSteps : 20;
  
  // Calculate fractional progress from 0.05 to 1.0
  let stepIndex = (currentCount + 1) % (totalSteps + 1);
  if (parseResult.success && parseResult.data.step !== undefined) {
    stepIndex = parseResult.data.step;
  }

  const fraction = Math.min(1.0, Math.max(0.02, stepIndex / totalSteps));

  // If forceGeofence is requested, place truck within 350 meters of destination
  let simLat: number;
  let simLng: number;
  let speed: number;

  if (parseResult.success && parseResult.data.forceGeofence) {
    // 350 meters from destination
    simLat = dest.lat + 0.0025;
    simLng = dest.lng + 0.0025;
    speed = 18;
  } else {
    // Linear interpolation with realistic arc curve
    const arcCurvature = Math.sin(fraction * Math.PI) * 0.08;
    simLat = origin.lat + (dest.lat - origin.lat) * fraction + arcCurvature;
    simLng = origin.lng + (dest.lng - origin.lng) * fraction;
    speed = fraction >= 0.95 ? 22 : 60 + Math.sin(fraction * 15) * 6;
  }

  const heading = calculateBearingDegrees(simLat, simLng, dest.lat, dest.lng);
  const tempF = load.equipment_type === 'REEFER'
    ? -2.4 + (Math.sin(fraction * 8) * 0.3)
    : 68.0;

  const hosHours = Math.max(1.0, 10.0 - fraction * 5.5);

  const pingResult = await (async () => {
    const pingId = crypto.randomUUID().replace(/-/g, '').toLowerCase();
    const carrierId = load.assigned_carrier_id || 'simulated-carrier';

    await c.env.DB.prepare(`
      INSERT INTO load_telemetry (
        id, load_id, carrier_id, latitude, longitude, speed_mph, heading_degrees,
        temperature_fahrenheit, hos_status, hos_hours_remaining, provider_source, recorded_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'DRIVING', ?, 'simulator', datetime('now'))
    `).bind(
      pingId,
      loadId,
      carrierId,
      simLat,
      simLng,
      Math.round(speed * 10) / 10,
      heading,
      Math.round(tempF * 10) / 10,
      Math.round(hosHours * 10) / 10
    ).run();

    // Check geofence
    const geofence = checkGeofenceTrigger(simLat, simLng, origin, dest, 500);
    let geofenceEventLogged = null;

    if (geofence.isTriggered && geofence.eventType) {
      const existing = (await c.env.DB.prepare(`
        SELECT id FROM load_geofence_events WHERE load_id = ? AND event_type = ?
      `).bind(loadId, geofence.eventType).first()) as any;

      if (!existing) {
        const eventId = crypto.randomUUID().replace(/-/g, '').toLowerCase();
        await c.env.DB.prepare(`
          INSERT INTO load_geofence_events (id, load_id, event_type, distance_meters, latitude, longitude, triggered_at)
          VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
        `).bind(eventId, loadId, geofence.eventType, geofence.distanceMeters, simLat, simLng).run();

        geofenceEventLogged = {
          id: eventId,
          eventType: geofence.eventType,
          distanceMeters: geofence.distanceMeters,
        };

        if (geofence.eventType === 'ENTER_DESTINATION') {
          await c.env.DB.prepare(`
            INSERT INTO load_events (id, load_id, actor_id, event_type, from_status, to_status, notes)
            VALUES (?, ?, ?, 'GEOFENCE_TRIGGER', 'IN_TRANSIT', 'ARRIVED_AT_DESTINATION', ?)
          `).bind(
            crypto.randomUUID().replace(/-/g, '').toLowerCase(),
            loadId,
            carrierId,
            `Automated geofence detected truck within ${geofence.distanceMeters}m of ${load.destination_city}. Prompting carrier for e-POD.`
          ).run().catch(() => {});
        }
      }
    }

    return {
      pingId,
      step: stepIndex,
      totalSteps,
      fractionProgress: Math.round(fraction * 100) / 100,
      coordinates: { lat: simLat, lng: simLng },
      speedMph: Math.round(speed * 10) / 10,
      headingDegrees: heading,
      temperatureFahrenheit: Math.round(tempF * 10) / 10,
      hosHoursRemaining: Math.round(hosHours * 10) / 10,
      geofence: {
        triggered: geofence.isTriggered,
        eventType: geofence.eventType,
        distanceMeters: geofence.distanceMeters,
        loggedEvent: geofenceEventLogged,
      },
    };
  })();

  return c.json({
    success: true,
    data: pingResult,
  });
});

/**
 * 4. POST /api/telematics/simulate-geofence/:loadId
 * Specifically tests delivery geofence entry (within 350 meters) to trigger ENTER_DESTINATION and prompt for e-POD.
 */
router.post('/simulate-geofence/:loadId', async (c) => {
  const loadId = c.req.param('loadId');
  await ensureTelematicsTables(c.env.DB);

  const load = (await c.env.DB.prepare(`
    SELECT id, assigned_carrier_id, destination_city, destination_state FROM loads WHERE id = ?
  `).bind(loadId).first()) as any;

  if (!load) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Load not found' } }, 404);
  }

  const dest = resolveLocationCoordinates(load.destination_city, load.destination_state);
  // Position truck approximately 320 meters from destination hub
  const arrivalLat = dest.lat + 0.0022;
  const arrivalLng = dest.lng + 0.0018;

  const pingId = crypto.randomUUID().replace(/-/g, '').toLowerCase();
  const carrierId = load.assigned_carrier_id || 'test-carrier';

  await c.env.DB.prepare(`
    INSERT INTO load_telemetry (
      id, load_id, carrier_id, latitude, longitude, speed_mph, heading_degrees,
      temperature_fahrenheit, hos_status, hos_hours_remaining, provider_source, recorded_at
    ) VALUES (?, ?, ?, ?, ?, 12.5, 90.0, -2.4, 'DRIVING', 6.5, 'simulator-geofence', datetime('now'))
  `).bind(pingId, loadId, carrierId, arrivalLat, arrivalLng).run();

  const distToDest = calculateHaversineDistanceMeters(arrivalLat, arrivalLng, dest.lat, dest.lng);

  const eventId = crypto.randomUUID().replace(/-/g, '').toLowerCase();
  await c.env.DB.prepare(`
    INSERT INTO load_geofence_events (id, load_id, event_type, distance_meters, latitude, longitude, triggered_at)
    VALUES (?, ?, 'ENTER_DESTINATION', ?, ?, ?, datetime('now'))
  `).bind(eventId, loadId, distToDest, arrivalLat, arrivalLng).run();

  // Log in-app event for POD upload
  await c.env.DB.prepare(`
    INSERT INTO load_events (id, load_id, actor_id, event_type, from_status, to_status, notes)
    VALUES (?, ?, ?, 'GEOFENCE_TRIGGER', 'IN_TRANSIT', 'ARRIVED_AT_DESTINATION', ?)
  `).bind(
    crypto.randomUUID().replace(/-/g, '').toLowerCase(),
    loadId,
    carrierId,
    `Delivery geofence triggered at ${distToDest}m. Auto-dispatch requested signed e-POD upload.`
  ).run().catch(() => {});

  return c.json({
    success: true,
    data: {
      loadId,
      geofenceTriggered: true,
      eventType: 'ENTER_DESTINATION',
      distanceMeters: distToDest,
      arrivalCoordinates: { lat: arrivalLat, lng: arrivalLng },
      actionRequired: 'UPLOAD_SIGNED_POD',
      message: `Truck entered ${load.destination_city} 500m geofence radius. Prompting carrier for e-POD upload.`,
    },
  });
});

/**
 * 5. GET /api/telematics/providers
 * Returns connected ELD providers for the authenticated carrier.
 */
router.get('/providers', authMiddleware, async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not logged in' } }, 401);
  }

  await ensureTelematicsTables(c.env.DB);

  const providers = (await c.env.DB.prepare(`
    SELECT id, provider_name as providerName, external_fleet_id as externalFleetId,
           vehicle_unit_id as vehicleUnitId, is_active as isActive, created_at as createdAt, updated_at as updatedAt
    FROM carrier_eld_providers
    WHERE carrier_id = ?
    ORDER BY created_at DESC
  `).bind(user.id).all()) as any;

  return c.json({
    success: true,
    data: providers.results || [],
  });
});

/**
 * 6. POST /api/telematics/providers
 * Register or update ELD connection credentials for carrier.
 */
router.post('/providers', authMiddleware, async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not logged in' } }, 401);
  }

  const body = await c.req.json().catch(() => ({}));
  const parseResult = providerSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: parseResult.error.message } }, 400);
  }

  await ensureTelematicsTables(c.env.DB);

  const { providerName, apiKey = '', externalFleetId = '', vehicleUnitId = '', isActive = true } = parseResult.data;

  // Check if provider record already exists
  const existing = (await c.env.DB.prepare(`
    SELECT id FROM carrier_eld_providers WHERE carrier_id = ? AND provider_name = ?
  `).bind(user.id, providerName).first()) as any;

  if (existing) {
    await c.env.DB.prepare(`
      UPDATE carrier_eld_providers
      SET api_key_encrypted = ?, external_fleet_id = ?, vehicle_unit_id = ?, is_active = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(apiKey, externalFleetId, vehicleUnitId, isActive ? 1 : 0, existing.id).run();

    return c.json({
      success: true,
      data: {
        id: existing.id,
        providerName,
        vehicleUnitId,
        isActive,
        message: 'ELD connection updated successfully',
      },
    });
  } else {
    const newId = crypto.randomUUID().replace(/-/g, '').toLowerCase();
    await c.env.DB.prepare(`
      INSERT INTO carrier_eld_providers (
        id, carrier_id, provider_name, api_key_encrypted, external_fleet_id, vehicle_unit_id, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(newId, user.id, providerName, apiKey, externalFleetId, vehicleUnitId, isActive ? 1 : 0).run();

    return c.json({
      success: true,
      data: {
        id: newId,
        providerName,
        vehicleUnitId,
        isActive,
        message: 'ELD provider connected successfully',
      },
    }, 201);
  }
});

/**
 * 7. Webhook Receivers: Samsara & Motive
 */
router.post('/webhook/samsara', async (c) => {
  const payload = await c.req.json().catch(() => ({}));
  const parsed = parseSamsaraWebhook(payload);
  const loadId = c.req.query('loadId') || payload?.loadId;

  if (loadId && parsed.lat && parsed.lng) {
    // Ingest location update
    await ensureTelematicsTables(c.env.DB);
    const pingId = crypto.randomUUID().replace(/-/g, '').toLowerCase();
    await c.env.DB.prepare(`
      INSERT INTO load_telemetry (id, load_id, carrier_id, latitude, longitude, speed_mph, heading_degrees, provider_source, recorded_at)
      VALUES (?, ?, 'samsara-webhook', ?, ?, ?, ?, 'samsara', datetime('now'))
    `).bind(pingId, loadId, parsed.lat, parsed.lng, parsed.speedMph || 60, parsed.headingDegrees || 0).run().catch(() => {});
  }

  return c.json({ success: true, received: true, provider: 'samsara' });
});

router.post('/webhook/motive', async (c) => {
  const payload = await c.req.json().catch(() => ({}));
  const parsed = parseMotiveWebhook(payload);
  const loadId = c.req.query('loadId') || payload?.load_id;

  if (loadId && parsed.lat && parsed.lng) {
    await ensureTelematicsTables(c.env.DB);
    const pingId = crypto.randomUUID().replace(/-/g, '').toLowerCase();
    await c.env.DB.prepare(`
      INSERT INTO load_telemetry (id, load_id, carrier_id, latitude, longitude, speed_mph, heading_degrees, hos_status, provider_source, recorded_at)
      VALUES (?, ?, 'motive-webhook', ?, ?, ?, ?, ?, 'motive', datetime('now'))
    `).bind(pingId, loadId, parsed.lat, parsed.lng, parsed.speedMph || 62, parsed.headingDegrees || 0, parsed.hosStatus || 'DRIVING').run().catch(() => {});
  }

  return c.json({ success: true, received: true, provider: 'motive' });
});

/**
 * 8. GET /api/telematics/:loadId/events
 * Get geofence milestone events log for the load.
 */
router.get('/:loadId/events', async (c) => {
  const loadId = c.req.param('loadId');
  await ensureTelematicsTables(c.env.DB);

  const events = (await c.env.DB.prepare(`
    SELECT id, event_type as eventType, distance_meters as distanceMeters,
           latitude, longitude, triggered_at as triggeredAt
    FROM load_geofence_events
    WHERE load_id = ?
    ORDER BY triggered_at DESC
  `).bind(loadId).all()) as any;

  return c.json({
    success: true,
    data: events.results || [],
  });
});

export default router;
