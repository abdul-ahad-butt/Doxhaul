-- Migration: Add Google Auth Support
ALTER TABLE users ADD COLUMN auth_provider TEXT NOT NULL DEFAULT 'local' CHECK (auth_provider IN ('local', 'google'));
ALTER TABLE users ADD COLUMN google_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
