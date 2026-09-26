# Deployment Guide

FreightLink relies on Cloudflare's ecosystem for edge deployment.

## Backend (API Worker + D1 + R2)

1. Connect to Cloudflare:
   ```bash
   npx wrangler login
   ```
2. Create D1 Database:
   ```bash
   npx wrangler d1 create freightlink-db
   ```
   *Update `apps/api/wrangler.toml` with the generated `database_id`.*

3. Create R2 Bucket:
   ```bash
   npx wrangler r2 bucket create freightlink-documents
   ```

4. Run Migrations:
   ```bash
   npm run db:migrate:prod
   ```

5. Deploy Worker:
   ```bash
   cd apps/api
   npm run deploy
   ```

## Frontend (Cloudflare Pages)

1. Build the React App:
   ```bash
   cd apps/web
   npm run build
   ```
2. Deploy to Pages:
   ```bash
   npx wrangler pages deploy dist --project-name freightlink-web
   ```

3. Ensure you set the `VITE_API_URL` environment variable if your API Worker URL is hosted on a separate domain.
