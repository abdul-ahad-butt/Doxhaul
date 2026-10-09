-- Migration: ELD Telematics & Geofencing Tracking Engine
-- Extends D1 database for vehicle telematics, provider integrations, and automated geofence milestone logs

-- 1. Carrier ELD Integrations
CREATE TABLE IF NOT EXISTS carrier_eld_providers (
    id TEXT PRIMARY KEY,
    carrier_id TEXT NOT NULL,
    provider_name TEXT NOT NULL, -- 'samsara' | 'motive' | 'project44' | 'simulator'
    api_key_encrypted TEXT,
    external_fleet_id TEXT,
    vehicle_unit_id TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (carrier_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_carrier_eld_carrier ON carrier_eld_providers(carrier_id);
CREATE INDEX IF NOT EXISTS idx_carrier_eld_active ON carrier_eld_providers(is_active);

-- 2. Live Vehicle Telemetry Pings
CREATE TABLE IF NOT EXISTS load_telemetry (
    id TEXT PRIMARY KEY,
    load_id TEXT NOT NULL,
    carrier_id TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    speed_mph REAL DEFAULT 0,
    heading_degrees REAL DEFAULT 0,
    temperature_fahrenheit REAL, -- For Reefer loads
    hos_status TEXT DEFAULT 'DRIVING', -- 'OFF_DUTY' | 'SLEEPER' | 'DRIVING' | 'ON_DUTY'
    hos_hours_remaining REAL DEFAULT 8.5,
    provider_source TEXT DEFAULT 'simulator',
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (load_id) REFERENCES loads(id)
);

CREATE INDEX IF NOT EXISTS idx_telemetry_load ON load_telemetry(load_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_telemetry_carrier ON load_telemetry(carrier_id);

-- 3. Geofence Milestones Log
CREATE TABLE IF NOT EXISTS load_geofence_events (
    id TEXT PRIMARY KEY,
    load_id TEXT NOT NULL,
    event_type TEXT NOT NULL, -- 'ENTER_ORIGIN' | 'EXIT_ORIGIN' | 'ENTER_DESTINATION' | 'DELIVERED'
    distance_meters REAL NOT NULL,
    latitude REAL,
    longitude REAL,
    triggered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (load_id) REFERENCES loads(id)
);

CREATE INDEX IF NOT EXISTS idx_geofence_load ON load_geofence_events(load_id, triggered_at DESC);
