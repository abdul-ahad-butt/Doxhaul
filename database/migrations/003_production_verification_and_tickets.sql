-- Migration: Production Verification & Support Desk Schema
-- Add verification status and rejection reason to users table
ALTER TABLE users ADD COLUMN verification_status TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION';
ALTER TABLE users ADD COLUMN rejection_reason TEXT;
CREATE INDEX IF NOT EXISTS idx_users_verification_status ON users(verification_status);

-- Add alias columns to documents table
ALTER TABLE documents ADD COLUMN r2_key TEXT;
ALTER TABLE documents ADD COLUMN file_name TEXT;

-- Create support_tickets table if not exists
CREATE TABLE IF NOT EXISTS support_tickets (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    name TEXT,
    first_name TEXT,
    last_name TEXT,
    email TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('TECHNICAL', 'BILLING', 'DOCUMENT_VERIFICATION', 'PLATFORM', 'PLATFORM_INQUIRY')),
    subject TEXT,
    message TEXT NOT NULL,
    screenshot_r2_key TEXT,
    status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_category ON support_tickets(category);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON support_tickets(user_id);
