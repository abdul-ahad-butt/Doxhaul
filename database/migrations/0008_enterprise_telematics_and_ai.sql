-- Migration 0008: Enterprise Telematics, Gemini AI Engine & BOL/POD Audits
-- Cloudflare D1 / SQLite compliant migration

-- 1. Integration Credentials in Admin Settings
INSERT OR IGNORE INTO platform_settings (key, value, description) VALUES
    ('gemini_api_key', '', 'Google Gemini API key for AI Chat Guard and Vision OCR'),
    ('gemini_chat_guard_enabled', '1', 'Flag to enable Gemini AI anti-circumvention chat monitor (1=enabled, 0=disabled)'),
    ('gemini_ocr_verification_enabled', '1', 'Flag to enable automated Gemini Vision POD & BOL audit (1=enabled, 0=disabled)'),
    ('samsara_api_token', '', 'Samsara API Bearer Token for live fleet GPS polling'),
    ('motive_api_key', '', 'KeepTruckin / Motive API Key for vehicle telematics'),
    ('project44_client_id', '', 'Project44 Movement API Client ID'),
    ('project44_client_secret', '', 'Project44 Movement API Client Secret'),
    ('telematics_active_provider', 'samsara', 'Active telematics gateway: samsara | motive | project44 | simulator');

-- 2. User Verification Badges
ALTER TABLE users ADD COLUMN is_verified INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN verified_at DATETIME;

-- 3. Document Verification Audits (BOL & POD)
CREATE TABLE IF NOT EXISTS load_documents (
    id TEXT PRIMARY KEY,
    load_id TEXT NOT NULL,
    uploader_id TEXT NOT NULL,
    document_type TEXT NOT NULL, -- 'BOL' | 'POD' | 'COI' | 'CDL'
    file_url TEXT NOT NULL,
    ai_status TEXT DEFAULT 'PENDING', -- 'PENDING' | 'VERIFIED' | 'FLAGGED' | 'REJECTED'
    ai_extracted_carrier TEXT,
    ai_extracted_shipper TEXT,
    ai_extracted_consignee_sig INTEGER DEFAULT 0,
    ai_signature_confidence REAL,
    ai_notes TEXT,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (load_id) REFERENCES loads(id) ON DELETE CASCADE,
    FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_load_docs_load_id ON load_documents(load_id);
CREATE INDEX IF NOT EXISTS idx_load_docs_uploader_id ON load_documents(uploader_id);
CREATE INDEX IF NOT EXISTS idx_load_docs_ai_status ON load_documents(ai_status);

-- 4. Bids Lifecycle & Fleet Equipment Tracking
ALTER TABLE bids ADD COLUMN vehicle_unit_id TEXT;
ALTER TABLE bids ADD COLUMN accepted_at DATETIME;
