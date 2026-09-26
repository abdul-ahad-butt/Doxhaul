# FreightLink Architecture

## Overview
FreightLink is a full-stack logistics marketplace built using Cloudflare Workers, Cloudflare D1 (SQLite), Cloudflare R2, and React + Vite.

## Backend
- **Framework**: Hono
- **Database**: Cloudflare D1
- **Storage**: Cloudflare R2
- **Authentication**: JWT, custom bearer token implementation

## Frontend
- **Framework**: React 18, Vite
- **Routing**: React Router DOM v6
- **State Management**: TanStack React Query v5
- **Styling**: Tailwind CSS
- **API Client**: Custom Fetch wrapper

## Database Schema (D1)
- `users`: Core identity, password hashes, roles.
- `profiles`: User information (address, MC, DOT).
- `documents`: References to objects in R2.
- `loads`: Load postings.
- `bookings`: Join table for carrier bookings.
