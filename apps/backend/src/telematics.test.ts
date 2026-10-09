import { describe, it, expect } from 'vitest';
import {
  calculateHaversineDistanceMeters,
  calculateBearingDegrees,
  checkGeofenceTrigger,
  parseSamsaraWebhook,
  parseMotiveWebhook,
  resolveLocationCoordinates
} from './services/telematics';

describe('Telematics Service & Geofencing Engine', () => {
  it('calculates Haversine distance accurately', () => {
    // Chicago Loop coordinates
    const pt1 = { lat: 41.8781, lng: -87.6298 };
    // Point ~350 meters North
    const pt2 = { lat: 41.8812, lng: -87.6298 };

    const distanceMeters = calculateHaversineDistanceMeters(pt1.lat, pt1.lng, pt2.lat, pt2.lng);
    expect(distanceMeters).toBeGreaterThan(300);
    expect(distanceMeters).toBeLessThan(400);
  });

  it('calculates bearing degrees correctly for eastward movement', () => {
    const start = { lat: 40.0, lng: -85.0 };
    const east = { lat: 40.0, lng: -84.0 };
    const bearing = calculateBearingDegrees(start.lat, start.lng, east.lat, east.lng);
    expect(bearing).toBeGreaterThanOrEqual(85);
    expect(bearing).toBeLessThanOrEqual(95);
  });

  it('triggers ENTER_DESTINATION when truck is within 500m geofence', () => {
    const origin = { lat: 41.8781, lng: -87.6298 };
    const destination = { lat: 39.9612, lng: -82.9988 };

    // Truck arriving 350 meters from destination
    const truckArrival = { lat: 39.9635, lng: -82.9988 };

    const trigger = checkGeofenceTrigger(
      truckArrival.lat,
      truckArrival.lng,
      origin,
      destination,
      { wasAtOrigin: false, hasEnteredDestination: false }
    );

    expect(trigger).not.toBeNull();
    expect(trigger.isTriggered).toBe(true);
    expect(trigger.eventType).toBe('ENTER_DESTINATION');
    expect(trigger.distanceMeters).toBeLessThanOrEqual(500);
    expect(trigger.shouldAdvanceStatus).toBe(true);
    expect(trigger.newStatus).toBe('ARRIVED_AT_DESTINATION');
  });

  it('triggers ENTER_ORIGIN when truck is at shipper facility within 500m', () => {
    const origin = { lat: 41.8781, lng: -87.6298 };
    const destination = { lat: 39.9612, lng: -82.9988 };

    // Truck inside shipper parking (200m away)
    const truckAtShipper = { lat: 41.8795, lng: -87.6298 };

    const trigger = checkGeofenceTrigger(
      truckAtShipper.lat,
      truckAtShipper.lng,
      origin,
      destination,
      { wasAtOrigin: false, hasEnteredDestination: false }
    );

    expect(trigger).not.toBeNull();
    expect(trigger.isTriggered).toBe(true);
    expect(trigger.eventType).toBe('ENTER_ORIGIN');
    expect(trigger.distanceMeters).toBeLessThanOrEqual(500);
    expect(trigger.newStatus).toBe('AT_PICKUP');
  });

  it('triggers EXIT_ORIGIN when truck departs shipper facility beyond 500m', () => {
    const origin = { lat: 41.8781, lng: -87.6298 };
    const destination = { lat: 39.9612, lng: -82.9988 };

    // Truck has left facility and is 2 miles onto interstate
    const truckOnInterstate = { lat: 41.8500, lng: -87.6298 };

    const trigger = checkGeofenceTrigger(
      truckOnInterstate.lat,
      truckOnInterstate.lng,
      origin,
      destination,
      { wasAtOrigin: true, hasEnteredDestination: false }
    );

    expect(trigger).not.toBeNull();
    expect(trigger.isTriggered).toBe(true);
    expect(trigger.eventType).toBe('EXIT_ORIGIN');
    expect(trigger.distanceMeters).toBeGreaterThan(500);
    expect(trigger.newStatus).toBe('IN_TRANSIT');
  });

  it('parses Samsara webhook payloads correctly', () => {
    const samsaraPayload = {
      event: {
        vehicle: { id: 'truck-99' },
        location: {
          latitude: 41.5201,
          longitude: -86.9542,
          speedMph: 63.5,
          headingDegrees: 112
        },
        reefer: {
          ambientTemp: -2.4
        },
        driver: {
          hosStatus: 'DRIVING',
          hoursRemaining: 8.2
        }
      }
    };

    const telemetry = parseSamsaraWebhook(samsaraPayload, 'load-100', 'carrier-1');
    expect(telemetry.lat).toBe(41.5201);
    expect(telemetry.lng).toBe(-86.9542);
    expect(telemetry.speedMph).toBe(63.5);
    expect(telemetry.temperatureFahrenheit).toBe(-2.4);
    expect(telemetry.hosStatus).toBe('DRIVING');
    expect(telemetry.providerSource).toBe('samsara');
  });

  it('parses KeepTruckin / Motive webhook payloads correctly', () => {
    const motivePayload = {
      vehicle_id: 'motive-v-42',
      current_location: {
        lat: 40.8521,
        lon: -85.1245,
        speed: 59.8,
        bearing: 90
      },
      telemetry: {
        cargo_temperature_f: 34.0
      },
      duty_status: 'DRIVING',
      clocks: {
        drive_remaining_hours: 6.75
      }
    };

    const telemetry = parseMotiveWebhook(motivePayload, 'load-200', 'carrier-2');
    expect(telemetry.lat).toBe(40.8521);
    expect(telemetry.lng).toBe(-85.1245);
    expect(telemetry.speedMph).toBe(59.8);
    expect(telemetry.temperatureFahrenheit).toBe(34.0);
    expect(telemetry.hosStatus).toBe('DRIVING');
    expect(telemetry.providerSource).toBe('motive');
  });

  it('resolves key national freight hub coordinates', () => {
    const chicago = resolveLocationCoordinates('Chicago', 'IL');
    expect(chicago.lat).toBeCloseTo(41.8781, 1);
    expect(chicago.lng).toBeCloseTo(-87.6298, 1);

    const dallas = resolveLocationCoordinates('Dallas', 'TX');
    expect(dallas.lat).toBeCloseTo(32.7767, 1);
    expect(dallas.lng).toBeCloseTo(-96.7970, 1);
  });
});
