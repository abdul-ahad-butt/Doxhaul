-- FreightLink Marketplace Database Schema
-- Cloudflare D1 / SQLite compatible

-- PRAGMAs removed for local miniflare compatibility
-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  auth_provider TEXT NOT NULL DEFAULT 'local' CHECK (auth_provider IN ('local', 'google')),
  google_id TEXT,
  role TEXT NOT NULL DEFAULT 'CARRIER' CHECK (role IN ('SHIPPER', 'BROKER', 'CARRIER', 'ADMIN')),
  status TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION' CHECK (status IN ('PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'BANNED')),
  verification_status TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION' CHECK (verification_status IN ('PENDING_VERIFICATION', 'PENDING', 'APPROVED', 'VERIFIED', 'REJECTED')),
  rejection_reason TEXT,
  email_verified INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_verification_status ON users(verification_status);

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  company_name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  dot_number TEXT,
  mc_number TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT NOT NULL DEFAULT 'US',
  bio TEXT,
  equipment_types TEXT, -- JSON array stored as text
  operating_regions TEXT, -- JSON array stored as text
  verification_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED')),
  verification_notes TEXT,
  avatar_key TEXT,
  website TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_verification_status ON profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_profiles_company_name ON profiles(company_name);

-- ============================================================
-- DOCUMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('DOT_CERTIFICATE', 'MC_CERTIFICATE', 'INSURANCE_CERTIFICATE', 'DRIVER_LICENSE', 'W9', 'BUSINESS_LICENSE', 'POD', 'BOL', 'RATE_CONFIRMATION', 'OTHER')),
  object_key TEXT NOT NULL UNIQUE,
  r2_key TEXT,
  original_filename TEXT NOT NULL,
  file_name TEXT,
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED')),
  rejection_reason TEXT,
  reviewed_by TEXT REFERENCES users(id),
  uploaded_at TEXT NOT NULL DEFAULT (datetime('now')),
  reviewed_at TEXT,
  expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type);

-- ============================================================
-- LOADS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS loads (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  owner_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  owner_company_name TEXT NOT NULL DEFAULT '',
  reference_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  origin_city TEXT NOT NULL,
  origin_state TEXT NOT NULL,
  origin_zip TEXT,
  origin_country TEXT NOT NULL DEFAULT 'US',
  destination_city TEXT NOT NULL,
  destination_state TEXT NOT NULL,
  destination_zip TEXT,
  destination_country TEXT NOT NULL DEFAULT 'US',
  pickup_date TEXT NOT NULL,
  delivery_date TEXT NOT NULL,
  mileage INTEGER,
  rate_per_mile REAL,
  equipment_type TEXT NOT NULL CHECK (equipment_type IN ('DRY_VAN', 'REEFER', 'FLATBED', 'STEP_DECK', 'BOX_TRUCK', 'TANKER', 'LOWBOY', 'OTHER')),
  weight REAL NOT NULL,
  weight_unit TEXT NOT NULL DEFAULT 'LBS',
  length REAL,
  width REAL,
  height REAL,
  commodity TEXT,
  rate REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  rate_type TEXT NOT NULL DEFAULT 'FLAT' CHECK (rate_type IN ('FLAT', 'PER_MILE')),
  special_instructions TEXT,
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'ASSIGNED', 'HEADING_TO_PICKUP', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED')),
  assigned_carrier_id TEXT REFERENCES users(id),
  assigned_booking_id TEXT,
  pod_document_id TEXT REFERENCES documents(id),
  delivery_notes TEXT,
  is_deleted INTEGER NOT NULL DEFAULT 0,
  deleted_at TEXT,
  deleted_by TEXT REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_loads_owner_user_id ON loads(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_loads_status ON loads(status);
CREATE INDEX IF NOT EXISTS idx_loads_origin_state ON loads(origin_state);
CREATE INDEX IF NOT EXISTS idx_loads_destination_state ON loads(destination_state);
CREATE INDEX IF NOT EXISTS idx_loads_equipment_type ON loads(equipment_type);
CREATE INDEX IF NOT EXISTS idx_loads_pickup_date ON loads(pickup_date);
CREATE INDEX IF NOT EXISTS idx_loads_rate ON loads(rate);
CREATE INDEX IF NOT EXISTS idx_loads_reference_number ON loads(reference_number);
CREATE INDEX IF NOT EXISTS idx_loads_assigned_carrier_id ON loads(assigned_carrier_id);
CREATE INDEX IF NOT EXISTS idx_loads_is_deleted ON loads(is_deleted);
CREATE INDEX IF NOT EXISTS idx_loads_status_pickup ON loads(status, pickup_date);
CREATE INDEX IF NOT EXISTS idx_loads_equipment ON loads(equipment_type);

-- ============================================================
-- BIDS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS bids (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  load_id TEXT NOT NULL REFERENCES loads(id) ON DELETE RESTRICT,
  carrier_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'COUNTERED')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_bids_load_id_status ON bids(load_id, status);
CREATE INDEX IF NOT EXISTS idx_bids_carrier_id ON bids(carrier_id);

-- ============================================================
-- BOOKINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  load_id TEXT NOT NULL REFERENCES loads(id) ON DELETE RESTRICT,
  carrier_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED')),
  notes TEXT,
  booked_at TEXT NOT NULL DEFAULT (datetime('now')),
  accepted_at TEXT,
  rejected_at TEXT,
  cancelled_at TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(load_id, carrier_id)
);

CREATE INDEX IF NOT EXISTS idx_bookings_load_id ON bookings(load_id);
CREATE INDEX IF NOT EXISTS idx_bookings_carrier_id ON bookings(carrier_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- ============================================================
-- LOAD EVENTS TABLE (Audit trail for load status changes)
-- ============================================================
CREATE TABLE IF NOT EXISTS load_events (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  load_id TEXT NOT NULL REFERENCES loads(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  event_type TEXT NOT NULL,
  from_status TEXT,
  to_status TEXT,
  notes TEXT,
  metadata TEXT, -- JSON
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_load_events_load_id ON load_events(load_id);
CREATE INDEX IF NOT EXISTS idx_load_events_actor_id ON load_events(actor_id);

-- ============================================================
-- AUDIT LOGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  actor_id TEXT REFERENCES users(id),
  actor_role TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata TEXT, -- JSON
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================================
-- VERIFICATION REVIEWS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS verification_reviews (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewer_id TEXT REFERENCES users(id),
  action TEXT NOT NULL CHECK (action IN ('APPROVED', 'REJECTED', 'REQUESTED_CHANGES')),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_verification_reviews_user_id ON verification_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_reviews_reviewer_id ON verification_reviews(reviewer_id);

-- ============================================================
-- NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data TEXT, -- JSON
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- ============================================================
-- TRIGGERS for updated_at
-- ============================================================
CREATE TRIGGER IF NOT EXISTS update_users_updated_at
  AFTER UPDATE ON users FOR EACH ROW
  BEGIN
    UPDATE users SET updated_at = datetime('now') WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_profiles_updated_at
  AFTER UPDATE ON profiles FOR EACH ROW
  BEGIN
    UPDATE profiles SET updated_at = datetime('now') WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_documents_updated_at
  AFTER UPDATE ON documents FOR EACH ROW
  BEGIN
    UPDATE documents SET updated_at = datetime('now') WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_loads_updated_at
  AFTER UPDATE ON loads FOR EACH ROW
  BEGIN
    UPDATE loads SET updated_at = datetime('now') WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_bookings_updated_at
  AFTER UPDATE ON bookings FOR EACH ROW
  BEGIN
    UPDATE bookings SET updated_at = datetime('now') WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_bids_updated_at
  AFTER UPDATE ON bids FOR EACH ROW
  BEGIN
    UPDATE bids SET updated_at = datetime('now') WHERE id = NEW.id;
  END;
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

CREATE TRIGGER IF NOT EXISTS update_tickets_updated_at
  AFTER UPDATE ON support_tickets FOR EACH ROW
  BEGIN
    UPDATE support_tickets SET updated_at = datetime('now') WHERE id = NEW.id;
  END;
