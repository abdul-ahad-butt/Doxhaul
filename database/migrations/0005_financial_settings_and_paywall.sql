-- Migration 0005: Platform Financial Settings & Role Paywall Policies
-- Cloudflare D1 / SQLite compliant migration

-- 1. Dynamic Platform Settings Table
CREATE TABLE IF NOT EXISTS platform_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed defaults matching Admin Panel Section B
INSERT OR IGNORE INTO platform_settings (key, value, description) VALUES
    ('platform_commission_percent', '8', 'Platform commission percentage deducted from completed loads'),
    ('platform_fee_percent', '8', 'Platform commission percentage alias'),
    ('carrier_onboarding_fee', '25', 'Driver registration & verification fee in USD'),
    ('shipper_onboarding_fee', '30', 'Shipper registration fee in USD (set to 0 for free)'),
    ('broker_onboarding_fee', '50', 'Broker registration & compliance fee in USD');

-- 2. Add Paywall and Terms Columns to Users
ALTER TABLE users ADD COLUMN terms_accepted INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN terms_accepted_at DATETIME;
ALTER TABLE users ADD COLUMN onboarding_payment_status TEXT DEFAULT 'ACTIVE'; -- 'PENDING_PAYMENT' | 'ACTIVE' | 'WAIVED'
ALTER TABLE users ADD COLUMN onboarding_fee_paid REAL DEFAULT 0;
