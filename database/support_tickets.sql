CREATE TABLE IF NOT EXISTS support_tickets (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('TECHNICAL', 'BILLING', 'DOCUMENT_VERIFICATION', 'PLATFORM_INQUIRY')),
    subject TEXT,
    message TEXT NOT NULL,
    screenshot_r2_key TEXT,
    status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_category ON support_tickets(category);

CREATE TRIGGER IF NOT EXISTS update_tickets_updated_at
  AFTER UPDATE ON support_tickets FOR EACH ROW
  BEGIN
    UPDATE support_tickets SET updated_at = datetime('now') WHERE id = NEW.id;
  END;
