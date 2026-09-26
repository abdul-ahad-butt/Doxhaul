# FreightLink Marketplace

A full-stack logistics marketplace connecting Shippers, Freight Brokers, Carriers/Drivers, and Platform Administrators. Built entirely on the Cloudflare stack (Workers, D1, R2, Pages).

## Project Structure

This is a monorepo setup containing:
- `apps/api/`: Cloudflare Worker (Hono) backend.
- `apps/web/`: React + Vite frontend application.
- `database/`: Database schema, migrations, and seed files.

## Technology Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- React Router
- TanStack Query (React Query)
- Lucide React

**Backend:**
- Cloudflare Workers
- Hono
- Zod (Validation)
- Web Crypto API (Password Hashing)

**Database & Storage:**
- Cloudflare D1 (SQLite)
- Cloudflare R2 (Object Storage)

## Prerequisites

- Node.js (v18+)
- npm
- Wrangler CLI (`npm install -g wrangler`)
- A Cloudflare account

## Local Development Setup

1. **Install Dependencies:**
   From the root directory, install all workspace dependencies:
   ```bash
   npm install
   ```

2. **Database Setup:**
   Run the local D1 migrations and seed the database with initial data (including demo accounts).
   ```bash
   cd apps/api
   npx wrangler d1 execute freightlink_db --local --file=../../database/schema.sql
   npx wrangler d1 execute freightlink_db --local --file=../../database/seed.sql
   ```

3. **Start the API:**
   Keep your terminal in `apps/api` and start the Wrangler development server:
   ```bash
   npm run dev
   ```
   *The API will start on `http://127.0.0.1:8787`.*

4. **Start the Frontend:**
   Open a new terminal, navigate to `apps/web`, and start Vite:
   ```bash
   cd apps/web
   npm run dev
   ```
   *The Web UI will start on `http://localhost:3000` and automatically proxy API requests to the Worker.*

## Demo Accounts

The `seed.sql` file creates several pre-verified accounts for testing:

- **Admin:** `admin@freightlink.dev` / `Admin123!`
- **Shipper:** `sarah@acmecorp.dev` / `Password123!`
- **Carrier:** `carlos@swiftlogistics.dev` / `Password123!`
- **Broker:** `tom@apexbrokerage.dev` / `Password123!`

## Deployment to Cloudflare

### 1. Provision Cloudflare Resources

You must first create the D1 database and R2 bucket in your Cloudflare dashboard (or via CLI):

```bash
# Create D1 Database
npx wrangler d1 create freightlink_db

# Create R2 Bucket
npx wrangler r2 bucket create freightlink-docs
```

*Important:* Update the `database_id` in `apps/api/wrangler.toml` with the ID output by the `d1 create` command.

### 2. Run Production Migrations

```bash
npx wrangler d1 execute freightlink_db --remote --file=../../database/schema.sql
npx wrangler d1 execute freightlink_db --remote --file=../../database/seed.sql
```

### 3. Deploy API Worker

```bash
cd apps/api
npm run deploy
```

### 4. Deploy Frontend to Cloudflare Pages

```bash
cd apps/web
npm run build
npx wrangler pages deploy dist --project-name=freightlink-web
```

Ensure you configure the Pages project to route `/api/*` to the deployed Worker if not handling CORS directly, or update `client.ts` BASE_URL to point directly to your deployed Worker URL (with CORS configured in the Worker).

## Security Notes
- Passwords are hashed using PBKDF2 with a random salt.
- Authentication relies on signed JWTs.
- D1 batches are used for atomic updates (e.g., booking loads) to prevent race conditions.
- Strict Role-Based Access Control (RBAC) via Hono middleware.
