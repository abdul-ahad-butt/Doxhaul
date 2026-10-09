-- Migration 0007: Dynamic Financial Settings, Onboarding Paywall, and Terms Agreement
-- Cloudflare D1 / SQLite compliant migration

-- 1. Ensure platform_settings table exists
CREATE TABLE IF NOT EXISTS platform_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed defaults matching Admin Panel Section B (Commission 8%, Carrier $25, Shipper $30, Broker $50)
INSERT OR IGNORE INTO platform_settings (key, value, description) VALUES
    ('platform_commission_percent', '8', 'Platform commission percentage deducted from completed loads'),
    ('platform_fee_percent', '8', 'Platform commission percentage alias'),
    ('carrier_onboarding_fee', '25', 'Driver registration & verification fee in USD'),
    ('shipper_onboarding_fee', '30', 'Shipper registration fee in USD (set to 0 for free)'),
    ('broker_onboarding_fee', '50', 'Broker registration & compliance fee in USD');

-- Update any existing defaults if they were old values
UPDATE platform_settings SET value = '8' WHERE key = 'platform_commission_percent' AND value = '';
UPDATE platform_settings SET value = '30' WHERE key = 'shipper_onboarding_fee' AND value = '0.00';

-- 2. Add Paywall and Terms Columns to Users table
-- Note: SQLite allows ADD COLUMN without breaking existing records
ALTER TABLE users ADD COLUMN terms_accepted INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN terms_accepted_at DATETIME;
ALTER TABLE users ADD COLUMN onboarding_payment_status TEXT DEFAULT 'ACTIVE'; -- 'PENDING_PAYMENT' | 'ACTIVE' | 'WAIVED'
ALTER TABLE users ADD COLUMN onboarding_fee_paid REAL DEFAULT 0;
