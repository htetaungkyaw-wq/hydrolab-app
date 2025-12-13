You are a senior full-stack engineer. Build a production-ready app named "hydrolab-app" with:

STACK
- Next.js 14 (App Router) + TypeScript + Tailwind
- UI: shadcn/ui + lucide-react + recharts
- Backend: Supabase (Postgres DB, Auth, Storage)
- Deployment: Vercel

MODULES
A) Public Marketing Website (no login)
B) Admin Dashboard (admin login required)
C) Customer Portal (customer login required)

CONTENT (HydroLab)
- Brand: HydroLab, tagline "Just Keep Hydrated"
- About text: Mark Two Seven Co., Ltd. (10+ years, inherits 20+ years TAC Water Engineering Enterprise), turnkey/custom water treatment; Venus Water (Myanmar) Co., Ltd. nationwide distributor of VENUS RO; water knowledge advocate (medical practitioner + water treatment expert).
- Industries: Residential, Commercial, Industrial, F&B, Healthcare/Lab, Municipal/Community, Desalination, Training, Consultation
- Project types/cards:
  1) Commercial RO Drinking Water Factory: turbidity & organic removal, water softening, micron & RO, UV; 3000 L/hr upgradable 6000
  2) Commercial Boiler Feed Water RO: turbidity & organic removal, iron reduction, micron & RO; 6000 upgradable 9000
  3) High-rise condominium treatment: turbidity & organic removal; 20000
  4) High-rise tower softening: water softening; 20000
  5) Residential desalination brackish->fresh: turbidity & organic removal, softening, micron, UF, RO; 1000
  6) Hospital water treatment: aeration, chlorine oxidation, turbidity & organic removal, iron reduction; 7000
  7) Car spa: aeration, turbidity & organic removal, iron reduction, micron & UF; 2500
- Products: UF systems; IR Series (IR1/IR2/IR3 remove dissolved iron, odor, color, sediment; 3–7 steps depending on iron level and flow rate)
- Clients logo wall: Burger King, KFC, Coca-Cola, CP, Pan Pacific Yangon, Jasmine Ngapali Resort, The Ivy, Swisscontact (examples)
- Contact: Office 1 Insein Township Yangon, Office 2 Mayangone Township Yangon, phones 09 250 000 465 / 09 795 289 705

ROUTES
Public:
- /, /about, /solutions, /products, /projects, /clients, /contact
- /contact has “Request Site Survey” form -> stored in DB (leads table)

Admin (protected):
- /admin (KPIs)
- /admin/customers (CRUD)
- /admin/systems (CRUD installed systems per customer)
- /admin/maintenance (tickets + logs)
- /admin/content (CRUD projects, products, client logos; upload images)
- /admin/requests (view leads)

Customer portal (protected):
- /portal (overview of their systems)
- /portal/systems/[id] (filter status + alerts + maintenance timeline)
- /portal/service-request (create ticket)
- /portal/reports (download PDF summary)

SUPABASE DATA MODEL
Create SQL migrations (schema.sql) with:
- profiles (id uuid pk references auth.users, role text check in ('admin','customer'), name, phone, created_at)
- customers (id uuid pk, name, phone, email, address, township, created_at)
- systems (id uuid pk, customer_id uuid fk, system_type text, flow_rate_lph int, location text, installed_at date, notes text, created_at)
- filter_templates (id uuid pk, name text, default_life_days int, stage_order int)
- system_filters (id uuid pk, system_id uuid fk, template_id uuid fk, life_days_override int null, last_changed_at date, created_at)
- maintenance_tickets (id uuid pk, customer_id uuid fk, system_id uuid fk, status text, subject text, description text, created_at, updated_at)
- maintenance_logs (id uuid pk, system_id uuid fk, performed_at date, summary text, technician_name text, next_due_at date)
- leads (id uuid pk, name, phone, email, location, category, message, created_at)
- media_assets (id uuid pk, kind text check in ('project','product','client_logo'), title text, bucket text, path text, created_at)
- projects (id uuid pk, title, category, description, flow_rate_lph int, solutions jsonb, created_at)
- project_photos (id uuid pk, project_id uuid fk, asset_id uuid fk)

RLS + SECURITY
- Enable RLS on all tables.
- Policies:
  - Admin can read/write everything.
  - Customer can read only their own customer row and their own systems/system_filters/tickets/logs.
  - Leads insert allowed from anonymous (public form), read only for admin.
- Implement role checks via profiles.role.
- Use Supabase Auth (email/password). Admin and customer accounts created via seed script or admin UI.

FILTER ALERT LOGIC (Frontend)
For each system_filter:
- life_days = life_days_override ?? template.default_life_days
- days_used = today - last_changed_at
- days_left = life_days - days_used
- status:
  - OK if days_left > 14
  - DUE_SOON if 0 < days_left <= 14
  - OVERDUE if days_left <= 0
Show progress bars/rings and an alert list.

STORAGE
- Use Supabase Storage buckets:
  - 'public-assets' for client logos + marketing images (public read)
  - 'protected-assets' for customer documents/reports (private)
- Admin uploads images in /admin/content via signed upload or direct supabase client upload, store metadata in media_assets.

PDF REPORT
- Implement /api/reports/system/[id] route (Next.js route handler) to generate a simple PDF (system info + filters + alerts + maintenance logs) and stream it to the browser. Use a lightweight PDF library compatible with Vercel (e.g., pdf-lib). Only allow authenticated customer who owns the system or admin.

APP IMPLEMENTATION DETAILS
- Use server components where appropriate.
- Use supabase-js on server (route handlers + server actions) with service role only where needed; otherwise rely on RLS.
- Use middleware to protect /admin and /portal routes.
- Provide .env.example with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY plus SUPABASE_SERVICE_ROLE_KEY for server only.
- Provide a seed script (node) to insert filter_templates and the 7 project cards, and to create one admin profile and one demo customer with a demo system + filters.

DEPLOYMENT
- Provide a README with exact Vercel steps:
  - Create Supabase project
  - Run schema.sql in SQL editor
  - Create storage buckets and policies
  - Add env vars to Vercel
  - Deploy
- Ensure `npm run dev`, `npm run build` succeed.

DELIVERABLES
- Output full code for all files.
- Output schema.sql, seed script, and README with step-by-step instructions.
