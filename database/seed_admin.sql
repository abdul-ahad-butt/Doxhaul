INSERT INTO users (id, email, password_hash, role, status, email_verified, created_at, updated_at)
VALUES (
  'admin_abdul_ahad',
  'abdulahadbutt420@gmail.com',
  '$pbkdf2$100000$6667c277c9c5ed30c5e49ccf7f1ad20b$bc7731b2d944333f31aff5617d1ca4180472256cb018ad3e0b2b815663822b64',
  'ADMIN',
  'ACTIVE',
  1,
  datetime('now'),
  datetime('now')
)
ON CONFLICT(email) DO UPDATE SET
  password_hash = excluded.password_hash,
  role = 'ADMIN',
  status = 'ACTIVE',
  email_verified = 1,
  updated_at = datetime('now');
