const crypto = require('crypto');

async function generateHash(password) {
    const salt = crypto.webcrypto.getRandomValues(new Uint8Array(16));
    const keyMaterial = await crypto.webcrypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );
    const key = await crypto.webcrypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    const exportedKey = await crypto.webcrypto.subtle.exportKey('raw', key);
    const hashBuffer = new Uint8Array(exportedKey);
    const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
    const hashHex = Array.from(hashBuffer).map(b => b.toString(16).padStart(2, '0')).join('');
    
    return `$pbkdf2$100000$${saltHex}$${hashHex}`;
}

async function main() {
    const email = 'abdulahadbutt420@gmail.com';
    const password = 'Doxhaul@Ahad04$$';
    const hash = await generateHash(password);

    const sql = `
INSERT INTO users (id, email, password_hash, role, status, email_verified, created_at, updated_at)
VALUES (
  'admin_abdul_ahad',
  '${email}',
  '${hash}',
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
`;

    console.log("=".repeat(80));
    console.log("🚀 CLOUDFLARE D1 ADMIN SEED SCRIPT");
    console.log("=".repeat(80));
    console.log("\nIf you received an Authentication Error (code: 10000) when trying to deploy to production,");
    console.log("it means your local Wrangler session has expired or lacks the correct OAuth permissions.");
    console.log("\nChoose ONE of the two methods below to seed your live D1 database:");
    
    console.log("\n--- METHOD 1: CLI (Wrangler) ---");
    console.log("1. Authenticate Wrangler by running:");
    console.log("   npx wrangler login");
    console.log("2. Then run the seed command:");
    console.log("   cd apps/backend && npx wrangler d1 execute freightlink-db --remote --file=../../database/seed_admin.sql");
    
    console.log("\n--- METHOD 2: CLOUDFLARE DASHBOARD (Console) ---");
    console.log("1. Go to your Cloudflare Dashboard -> Workers & Pages -> D1.");
    console.log("2. Click on 'freightlink-db' and navigate to the 'Console' tab.");
    console.log("3. Copy and paste the following SQL query and execute it:");
    console.log("\n" + sql.trim() + "\n");
    console.log("=".repeat(80));
}

main().catch(console.error);
