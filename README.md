# HydroLab App

HydroLab is a Next.js 14 + Supabase application with a marketing site, admin console, and customer portal for monitoring water treatment systems.

## Tech Stack
- Next.js 14 (App Router) + TypeScript + TailwindCSS
- UI: shadcn/ui foundations, lucide-react, recharts
- Backend: Supabase (Postgres, Auth, Storage)
- Deployment: Vercel

## Getting Started
1. Install dependencies
   ```bash
   npm install
   ```
2. Copy envs
   ```bash
   cp .env.example .env.local
   # fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
   ```
3. Run dev server
   ```bash
   npm run dev
   ```

## Database
- Apply SQL schema in Supabase SQL editor:
  ```sql
  -- schema.sql contents
  ```
- Tables include profiles, customers, systems, filters, maintenance tickets/logs, leads, media assets, and projects.
- RLS ensures admins can read/write all; customers only see their own rows; anonymous users can create leads.

### Storage Buckets
- `public-assets`: client logos & marketing assets (public read)
- `protected-assets`: customer documents/reports (private)

### Seeding
```
npm run seed
```
Seeds filter templates, an admin profile, a demo customer with one system + filters, and reference projects. Requires service role key.

## API
- `GET /api/reports/system/[id]` generates a PDF summary (system info, filters, maintenance). Uses pdf-lib and checks ownership via Supabase in production (RLS).

## Deployment to Vercel
1. Create Supabase project.
2. Create storage buckets `public-assets` and `protected-assets`. Configure public read on the first; keep the second private.
3. Run `schema.sql` in the Supabase SQL editor.
4. Add env vars to Vercel project settings: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
5. Deploy via Vercel (import Git repo). Vercel will run `npm run build`.
