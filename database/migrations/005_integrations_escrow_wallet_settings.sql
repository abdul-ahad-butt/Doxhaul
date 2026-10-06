-- Migration 005: Platform Settings, Wallets, and Transactions Ledger
-- Adds dynamic platform settings (Paddle, Persona, Fees), user escrow wallets, and ledger

-- 0. Add onboarding_paid flag to users
ALTER TABLE users ADD COLUMN onboarding_paid INTEGER NOT NULL DEFAULT 0;

-- 1. Dynamic Platform & API Settings (Paddle, Persona, Fees)
CREATE TABLE IF NOT EXISTS platform_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Seed default settings
INSERT OR IGNORE INTO platform_settings (key, value, description) VALUES
('paddle_environment', 'sandbox', 'Paddle environment: sandbox or production'),
('paddle_vendor_id', '', 'Paddle Vendor ID'),
('paddle_api_key', '', 'Paddle API Secret Key'),
('paddle_client_token', '', 'Paddle Client-side Token'),
('paddle_webhook_secret', '', 'Paddle Webhook Secret for signature validation'),
('platform_fee_percent', '7.5', 'Platform commission percentage deducted from completed loads'),
('carrier_onboarding_fee', '25.00', 'Carrier / Driver registration and verification fee in USD'),
('shipper_onboarding_fee', '0.00', 'Shipper registration fee in USD'),
('broker_onboarding_fee', '50.00', 'Broker registration and compliance fee in USD'),
('persona_environment', 'sandbox', 'Persona environment: sandbox or production'),
('persona_api_key', '', 'Persona API Secret Key'),
('persona_template_id', '', 'Persona KYC Inquiry Template ID');

-- 2. User Wallets
CREATE TABLE IF NOT EXISTS wallets (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    balance REAL NOT NULL DEFAULT 0.00,
    escrow_balance REAL NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'USD',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);

-- 3. Wallet Transactions Ledger
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id TEXT PRIMARY KEY,
    wallet_id TEXT NOT NULL,
    load_id TEXT,
    amount REAL NOT NULL,
    fee_deducted REAL NOT NULL DEFAULT 0.00,
    type TEXT NOT NULL CHECK (type IN ('DEPOSIT', 'ESCROW_LOCK', 'ESCROW_RELEASE', 'ONBOARDING_FEE', 'PLATFORM_FEE', 'PAYOUT_WITHDRAWAL')),
    status TEXT NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
    payment_provider TEXT DEFAULT 'PADDLE',
    provider_transaction_id TEXT,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (wallet_id) REFERENCES wallets(id)
);

CREATE INDEX IF NOT EXISTS idx_transactions_wallet ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_load ON wallet_transactions(load_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON wallet_transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON wallet_transactions(status);
