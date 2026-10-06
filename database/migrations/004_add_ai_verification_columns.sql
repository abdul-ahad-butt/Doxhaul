-- Migration 004: Add AI Document Verification Columns to documents table
-- Enables Cloudflare Workers AI & Gemini pre-screening results to be stored for fast 1-click admin approval

ALTER TABLE documents ADD COLUMN ai_verified INTEGER DEFAULT 0;
ALTER TABLE documents ADD COLUMN ai_confidence REAL DEFAULT 0;
ALTER TABLE documents ADD COLUMN ai_summary TEXT;
