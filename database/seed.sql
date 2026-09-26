-- FreightLink Marketplace - Development Seed Data
-- This file populates the database with realistic but clearly fictional demo data.
-- Do NOT use this in production.
-- PRAGMAs removed
-- ============================================================
-- ADMIN USER
-- Password: Admin123! (bcrypt hash)
-- ============================================================
INSERT OR IGNORE INTO users (id, email, password_hash, role, status, email_verified) VALUES
  ('admin-000-0000-0000-000000000001', 'admin@freightlink.dev', '$2b$10$rKN4mPDxLJDI9GAqTHQ4VOX.VJGBaYWy3hbVFkJMhv16VKvb4Kj7W', 'ADMIN', 'ACTIVE', 1);

INSERT OR IGNORE INTO profiles (id, user_id, first_name, last_name, company_name, phone, city, state, verification_status) VALUES
  ('profile-000-0000-0000-000000000001', 'admin-000-0000-0000-000000000001', 'Platform', 'Admin', 'FreightLink Operations', '555-000-0001', 'Austin', 'TX', 'VERIFIED');

-- ============================================================
-- SHIPPER USERS
-- Password for all: Password123!
-- ============================================================
INSERT OR IGNORE INTO users (id, email, password_hash, role, status, email_verified) VALUES
  ('user-sh01-0000-0000-000000000001', 'sarah@acmecorp.dev', '$2b$10$rKN4mPDxLJDI9GAqTHQ4VOX.VJGBaYWy3hbVFkJMhv16VKvb4Kj7W', 'SHIPPER', 'ACTIVE', 1),
  ('user-sh02-0000-0000-000000000002', 'mike@starwidgets.dev', '$2b$10$rKN4mPDxLJDI9GAqTHQ4VOX.VJGBaYWy3hbVFkJMhv16VKvb4Kj7W', 'SHIPPER', 'ACTIVE', 1),
  ('user-sh03-0000-0000-000000000003', 'jen@pendingshipper.dev', '$2b$10$rKN4mPDxLJDI9GAqTHQ4VOX.VJGBaYWy3hbVFkJMhv16VKvb4Kj7W', 'SHIPPER', 'PENDING_VERIFICATION', 0);

INSERT OR IGNORE INTO profiles (id, user_id, first_name, last_name, company_name, phone, address, city, state, zip, verification_status) VALUES
  ('profile-sh01-0000-0000-000000000001', 'user-sh01-0000-0000-000000000001', 'Sarah', 'Johnson', 'Acme Corp Shippers', '312-555-0101', '100 W Adams St', 'Chicago', 'IL', '60601', 'VERIFIED'),
  ('profile-sh02-0000-0000-000000000002', 'user-sh02-0000-0000-000000000002', 'Mike', 'Williams', 'Star Widgets Inc', '713-555-0202', '1001 Main St', 'Houston', 'TX', '77002', 'VERIFIED'),
  ('profile-sh03-0000-0000-000000000003', 'user-sh03-0000-0000-000000000003', 'Jennifer', 'Lee', 'Pending Shipper LLC', '602-555-0303', '400 E Van Buren St', 'Phoenix', 'AZ', '85004', 'PENDING');

-- ============================================================
-- BROKER USERS
-- ============================================================
INSERT OR IGNORE INTO users (id, email, password_hash, role, status, email_verified) VALUES
  ('user-br01-0000-0000-000000000001', 'tom@apexbrokerage.dev', '$2b$10$rKN4mPDxLJDI9GAqTHQ4VOX.VJGBaYWy3hbVFkJMhv16VKvb4Kj7W', 'BROKER', 'ACTIVE', 1),
  ('user-br02-0000-0000-000000000002', 'lisa@bridgefreight.dev', '$2b$10$rKN4mPDxLJDI9GAqTHQ4VOX.VJGBaYWy3hbVFkJMhv16VKvb4Kj7W', 'BROKER', 'ACTIVE', 1);

INSERT OR IGNORE INTO profiles (id, user_id, first_name, last_name, company_name, phone, mc_number, address, city, state, zip, verification_status) VALUES
  ('profile-br01-0000-0000-000000000001', 'user-br01-0000-0000-000000000001', 'Thomas', 'Anderson', 'Apex Brokerage LLC', '214-555-0401', 'MC-854321', '2200 Ross Ave', 'Dallas', 'TX', '75201', 'VERIFIED'),
  ('profile-br02-0000-0000-000000000002', 'user-br02-0000-0000-000000000002', 'Lisa', 'Bridge', 'Bridge Freight Group', '312-555-0402', 'MC-765432', '233 S Wacker Dr', 'Chicago', 'IL', '60606', 'VERIFIED');

-- ============================================================
-- CARRIER USERS
-- ============================================================
INSERT OR IGNORE INTO users (id, email, password_hash, role, status, email_verified) VALUES
  ('user-ca01-0000-0000-000000000001', 'carlos@swiftlogistics.dev', '$2b$10$rKN4mPDxLJDI9GAqTHQ4VOX.VJGBaYWy3hbVFkJMhv16VKvb4Kj7W', 'CARRIER', 'ACTIVE', 1),
  ('user-ca02-0000-0000-000000000002', 'diana@eagletransport.dev', '$2b$10$rKN4mPDxLJDI9GAqTHQ4VOX.VJGBaYWy3hbVFkJMhv16VKvb4Kj7W', 'CARRIER', 'ACTIVE', 1),
  ('user-ca03-0000-0000-000000000003', 'raj@pendingcarrier.dev', '$2b$10$rKN4mPDxLJDI9GAqTHQ4VOX.VJGBaYWy3hbVFkJMhv16VKvb4Kj7W', 'CARRIER', 'PENDING_VERIFICATION', 0),
  ('user-ca04-0000-0000-000000000004', 'bob@rejectedcarrier.dev', '$2b$10$rKN4mPDxLJDI9GAqTHQ4VOX.VJGBaYWy3hbVFkJMhv16VKvb4Kj7W', 'CARRIER', 'ACTIVE', 1);

INSERT OR IGNORE INTO profiles (id, user_id, first_name, last_name, company_name, phone, dot_number, mc_number, address, city, state, zip, equipment_types, operating_regions, verification_status, verification_notes) VALUES
  ('profile-ca01-0000-0000-000000000001', 'user-ca01-0000-0000-000000000001', 'Carlos', 'Rivera', 'Swift Logistics LLC', '602-555-0501', 'DOT-3821456', 'MC-912345', '5000 E Camelback Rd', 'Phoenix', 'AZ', '85018', '["DRY_VAN","REEFER"]', '["Southwest","Midwest","Southeast"]', 'VERIFIED', NULL),
  ('profile-ca02-0000-0000-000000000002', 'user-ca02-0000-0000-000000000002', 'Diana', 'Chen', 'Eagle Transport Co', '303-555-0502', 'DOT-2719843', 'MC-823456', '1600 Glenarm Pl', 'Denver', 'CO', '80202', '["FLATBED","STEP_DECK"]', '["Mountain","Southwest","Midwest"]', 'VERIFIED', NULL),
  ('profile-ca03-0000-0000-000000000003', 'user-ca03-0000-0000-000000000003', 'Raj', 'Patel', 'Patel Freight Inc', '404-555-0503', 'DOT-1234567', 'MC-734567', '100 Peachtree St', 'Atlanta', 'GA', '30303', '["DRY_VAN","BOX_TRUCK"]', '["Southeast","East"]', 'PENDING', NULL),
  ('profile-ca04-0000-0000-000000000004', 'user-ca04-0000-0000-000000000004', 'Robert', 'Smith', 'Smith Hauling LLC', '901-555-0504', 'DOT-9876543', 'MC-645678', '200 N Main St', 'Memphis', 'TN', '38103', '["DRY_VAN"]', '["Southeast","Midwest"]', 'REJECTED', 'Insurance certificate expired. Please upload a current certificate of insurance.');

-- ============================================================
-- DEMO LOADS
-- ============================================================
INSERT OR IGNORE INTO loads (id, owner_user_id, owner_company_name, reference_number, title, origin_city, origin_state, origin_zip, destination_city, destination_state, destination_zip, pickup_date, delivery_date, equipment_type, weight, rate, special_instructions, status, assigned_carrier_id) VALUES
  -- OPEN loads
  ('load-0001-0000-0000-000000000001', 'user-sh01-0000-0000-000000000001', 'Acme Corp Shippers', 'FL-2024-001', 'Palletized Consumer Electronics', 'Chicago', 'IL', '60601', 'Dallas', 'TX', '75201', '2024-02-15', '2024-02-17', 'DRY_VAN', 24500, 2450, 'Temperature sensitive packaging. Handle with care. Liftgate required at delivery.', 'OPEN', NULL),
  ('load-0002-0000-0000-000000000002', 'user-sh01-0000-0000-000000000001', 'Acme Corp Shippers', 'FL-2024-002', 'Household Appliances - Refrigerators', 'Chicago', 'IL', '60601', 'Nashville', 'TN', '37201', '2024-02-18', '2024-02-19', 'DRY_VAN', 32000, 1850, 'Must use straps. No stacking.', 'OPEN', NULL),
  ('load-0003-0000-0000-000000000003', 'user-br01-0000-0000-000000000001', 'Apex Brokerage LLC', 'FL-2024-003', 'Fresh Produce - Mixed Vegetables', 'Salinas', 'CA', '93901', 'Phoenix', 'AZ', '85001', '2024-02-16', '2024-02-17', 'REEFER', 40000, 3200, 'Keep at 34F. Time-sensitive delivery.', 'OPEN', NULL),
  ('load-0004-0000-0000-000000000004', 'user-sh02-0000-0000-000000000002', 'Star Widgets Inc', 'FL-2024-004', 'Industrial Machinery Parts', 'Houston', 'TX', '77002', 'Denver', 'CO', '80202', '2024-02-20', '2024-02-22', 'FLATBED', 45000, 4200, 'Oversized load permit required. Escort vehicle needed.', 'OPEN', NULL),
  ('load-0005-0000-0000-000000000005', 'user-br02-0000-0000-000000000002', 'Bridge Freight Group', 'FL-2024-005', 'Auto Parts - Engine Components', 'Detroit', 'MI', '48201', 'Atlanta', 'GA', '30301', '2024-02-21', '2024-02-23', 'DRY_VAN', 18000, 2100, NULL, 'OPEN', NULL),

  -- ASSIGNED load
  ('load-0006-0000-0000-000000000006', 'user-sh01-0000-0000-000000000001', 'Acme Corp Shippers', 'FL-2024-006', 'Office Furniture - Conference Tables', 'Los Angeles', 'CA', '90001', 'Seattle', 'WA', '98101', '2024-02-14', '2024-02-16', 'DRY_VAN', 22000, 3100, 'White glove delivery required.', 'ASSIGNED', 'user-ca01-0000-0000-000000000001'),

  -- IN_TRANSIT load
  ('load-0007-0000-0000-000000000007', 'user-br01-0000-0000-000000000001', 'Apex Brokerage LLC', 'FL-2024-007', 'Steel Beams & Construction Kits', 'Houston', 'TX', '77001', 'Denver', 'CO', '80201', '2024-02-12', '2024-02-15', 'FLATBED', 46000, 4800, 'Tarps required. Wide load.', 'IN_TRANSIT', 'user-ca02-0000-0000-000000000002'),

  -- DELIVERED load
  ('load-0008-0000-0000-000000000008', 'user-sh02-0000-0000-000000000002', 'Star Widgets Inc', 'FL-2024-008', 'Consumer Goods - Holiday Merchandise', 'Miami', 'FL', '33101', 'Atlanta', 'GA', '30301', '2024-02-01', '2024-02-03', 'DRY_VAN', 28000, 1950, NULL, 'DELIVERED', 'user-ca01-0000-0000-000000000001'),

  -- HEADING_TO_PICKUP
  ('load-0009-0000-0000-000000000009', 'user-sh01-0000-0000-000000000001', 'Acme Corp Shippers', 'FL-2024-009', 'Pharmaceutical Supplies', 'Indianapolis', 'IN', '46201', 'Columbus', 'OH', '43201', '2024-02-15', '2024-02-16', 'REEFER', 15000, 1600, 'Temperature controlled 36-46F. Chain of custody documentation required.', 'HEADING_TO_PICKUP', 'user-ca02-0000-0000-000000000002'),

  -- More OPEN loads
  ('load-0010-0000-0000-000000000010', 'user-br01-0000-0000-000000000001', 'Apex Brokerage LLC', 'FL-2024-010', 'Lumber & Building Materials', 'Portland', 'OR', '97201', 'Sacramento', 'CA', '95814', '2024-02-22', '2024-02-24', 'FLATBED', 42000, 3600, 'Strapping required.', 'OPEN', NULL),
  ('load-0011-0000-0000-000000000011', 'user-sh02-0000-0000-000000000002', 'Star Widgets Inc', 'FL-2024-011', 'Medical Equipment - Hospital Beds', 'Minneapolis', 'MN', '55401', 'Kansas City', 'MO', '64101', '2024-02-23', '2024-02-24', 'DRY_VAN', 20000, 2300, 'Fragile. Blanket wrap required.', 'OPEN', NULL),
  ('load-0012-0000-0000-000000000012', 'user-br02-0000-0000-000000000002', 'Bridge Freight Group', 'FL-2024-012', 'Frozen Foods - Seafood Mix', 'Seattle', 'WA', '98101', 'Las Vegas', 'NV', '89101', '2024-02-25', '2024-02-27', 'REEFER', 35000, 3800, 'Keep at -10F. Priority delivery.', 'OPEN', NULL);

-- ============================================================
-- BOOKINGS
-- ============================================================
INSERT OR IGNORE INTO bookings (id, load_id, carrier_id, status, booked_at, accepted_at, completed_at) VALUES
  ('booking-001-0000-0000-000000000001', 'load-0006-0000-0000-000000000006', 'user-ca01-0000-0000-000000000001', 'ACCEPTED', '2024-02-13T10:00:00', '2024-02-13T11:00:00', NULL),
  ('booking-002-0000-0000-000000000002', 'load-0007-0000-0000-000000000007', 'user-ca02-0000-0000-000000000002', 'ACCEPTED', '2024-02-11T09:00:00', '2024-02-11T10:00:00', NULL),
  ('booking-003-0000-0000-000000000003', 'load-0008-0000-0000-000000000008', 'user-ca01-0000-0000-000000000001', 'COMPLETED', '2024-01-31T14:00:00', '2024-01-31T15:00:00', '2024-02-03T16:00:00'),
  ('booking-004-0000-0000-000000000004', 'load-0009-0000-0000-000000000009', 'user-ca02-0000-0000-000000000002', 'ACCEPTED', '2024-02-13T08:00:00', '2024-02-13T09:00:00', NULL);

-- ============================================================
-- LOAD EVENTS
-- ============================================================
INSERT OR IGNORE INTO load_events (id, load_id, actor_id, event_type, from_status, to_status, notes) VALUES
  ('event-001', 'load-0006-0000-0000-000000000006', 'user-sh01-0000-0000-000000000001', 'LOAD_CREATED', NULL, 'OPEN', NULL),
  ('event-002', 'load-0006-0000-0000-000000000006', 'user-ca01-0000-0000-000000000001', 'BOOKING_ACCEPTED', 'OPEN', 'ASSIGNED', 'Carrier confirmed pickup window 8-10am'),
  ('event-003', 'load-0007-0000-0000-000000000007', 'user-br01-0000-0000-000000000001', 'LOAD_CREATED', NULL, 'OPEN', NULL),
  ('event-004', 'load-0007-0000-0000-000000000007', 'user-ca02-0000-0000-000000000002', 'BOOKING_ACCEPTED', 'OPEN', 'ASSIGNED', NULL),
  ('event-005', 'load-0007-0000-0000-000000000007', 'user-ca02-0000-0000-000000000002', 'STATUS_UPDATE', 'ASSIGNED', 'HEADING_TO_PICKUP', 'En route to pickup'),
  ('event-006', 'load-0007-0000-0000-000000000007', 'user-ca02-0000-0000-000000000002', 'STATUS_UPDATE', 'HEADING_TO_PICKUP', 'PICKED_UP', 'Load secured and picked up'),
  ('event-007', 'load-0007-0000-0000-000000000007', 'user-ca02-0000-0000-000000000002', 'STATUS_UPDATE', 'PICKED_UP', 'IN_TRANSIT', 'On the road'),
  ('event-008', 'load-0009-0000-0000-000000000009', 'user-sh01-0000-0000-000000000001', 'LOAD_CREATED', NULL, 'OPEN', NULL),
  ('event-009', 'load-0009-0000-0000-000000000009', 'user-ca02-0000-0000-000000000002', 'BOOKING_ACCEPTED', 'OPEN', 'ASSIGNED', NULL),
  ('event-010', 'load-0009-0000-0000-000000000009', 'user-ca02-0000-0000-000000000002', 'STATUS_UPDATE', 'ASSIGNED', 'HEADING_TO_PICKUP', 'Departed for pickup');

-- ============================================================
-- AUDIT LOGS
-- ============================================================
INSERT OR IGNORE INTO audit_logs (id, actor_id, actor_role, action, entity_type, entity_id, metadata) VALUES
  ('audit-001', 'admin-000-0000-0000-000000000001', 'ADMIN', 'USER_VERIFIED', 'USER', 'user-sh01-0000-0000-000000000001', '{"notes":"All documents verified"}'),
  ('audit-002', 'admin-000-0000-0000-000000000001', 'ADMIN', 'USER_VERIFIED', 'USER', 'user-ca01-0000-0000-000000000001', '{"notes":"DOT, MC, and insurance verified"}'),
  ('audit-003', 'admin-000-0000-0000-000000000001', 'ADMIN', 'USER_REJECTED', 'USER', 'user-ca04-0000-0000-000000000004', '{"reason":"Insurance certificate expired"}');
