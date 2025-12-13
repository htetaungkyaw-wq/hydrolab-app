-- Schema for HydroLab
create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','customer')),
  name text,
  phone text,
  created_at timestamptz default now()
);

create table if not exists public.customers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text,
  email text,
  address text,
  township text,
  created_at timestamptz default now()
);

create table if not exists public.systems (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references public.customers(id) on delete cascade,
  system_type text,
  flow_rate_lph int,
  location text,
  installed_at date,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.filter_templates (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  default_life_days int,
  stage_order int
);

create table if not exists public.system_filters (
  id uuid primary key default uuid_generate_v4(),
  system_id uuid references public.systems(id) on delete cascade,
  template_id uuid references public.filter_templates(id),
  life_days_override int,
  last_changed_at date,
  created_at timestamptz default now()
);

create table if not exists public.maintenance_tickets (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references public.customers(id) on delete cascade,
  system_id uuid references public.systems(id) on delete set null,
  status text,
  subject text,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.maintenance_logs (
  id uuid primary key default uuid_generate_v4(),
  system_id uuid references public.systems(id) on delete cascade,
  performed_at date,
  summary text,
  technician_name text,
  next_due_at date
);

create table if not exists public.leads (
  id uuid primary key default uuid_generate_v4(),
  name text,
  phone text,
  email text,
  location text,
  category text,
  message text,
  created_at timestamptz default now()
);

create table if not exists public.media_assets (
  id uuid primary key default uuid_generate_v4(),
  kind text check (kind in ('project','product','client_logo')),
  title text,
  bucket text,
  path text,
  created_at timestamptz default now()
);

create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text,
  description text,
  flow_rate_lph int,
  solutions jsonb,
  created_at timestamptz default now()
);

create table if not exists public.project_photos (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete cascade,
  asset_id uuid references public.media_assets(id) on delete cascade
);

alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.systems enable row level security;
alter table public.filter_templates enable row level security;
alter table public.system_filters enable row level security;
alter table public.maintenance_tickets enable row level security;
alter table public.maintenance_logs enable row level security;
alter table public.leads enable row level security;
alter table public.media_assets enable row level security;
alter table public.projects enable row level security;
alter table public.project_photos enable row level security;

create or replace function public.is_admin(uid uuid) returns boolean language sql security definer as $$
  select exists(select 1 from public.profiles p where p.id = uid and p.role = 'admin');
$$;

create policy "admin all profiles" on public.profiles
  for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));
create policy "self read profile" on public.profiles
  for select using (auth.uid() = id);

create policy "admin all customers" on public.customers for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));
create policy "customer read own" on public.customers for select using (
  exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'customer' and p.id = customers.id)
);

create policy "admin all systems" on public.systems for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));
create policy "customer read systems" on public.systems for select using (
  exists(select 1 from public.customers c join public.profiles p on p.id = auth.uid() and p.role='customer' where c.id = systems.customer_id and c.id = p.id)
);

create policy "admin all filter templates" on public.filter_templates for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));
create policy "read filter templates" on public.filter_templates for select using (true);

create policy "admin all system filters" on public.system_filters for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));
create policy "customer read system filters" on public.system_filters for select using (
  exists(select 1 from public.systems s join public.profiles p on p.id = auth.uid() and p.role='customer' where s.id = system_filters.system_id and s.customer_id = p.id)
);

create policy "admin all tickets" on public.maintenance_tickets for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));
create policy "customer read tickets" on public.maintenance_tickets for select using (
  exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='customer' and p.id = maintenance_tickets.customer_id)
);
create policy "customer create tickets" on public.maintenance_tickets for insert with check (
  exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='customer' and p.id = maintenance_tickets.customer_id)
);

create policy "admin all logs" on public.maintenance_logs for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));
create policy "customer read logs" on public.maintenance_logs for select using (
  exists(select 1 from public.systems s join public.profiles p on p.id = auth.uid() and p.role='customer' where s.id = maintenance_logs.system_id and s.customer_id = p.id)
);

create policy "admin read leads" on public.leads for select using (is_admin(auth.uid()));
create policy "public create leads" on public.leads for insert with check (true);

create policy "admin all media" on public.media_assets for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));
create policy "public read media" on public.media_assets for select using (true);

create policy "admin all projects" on public.projects for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));
create policy "public read projects" on public.projects for select using (true);

create policy "admin all project_photos" on public.project_photos for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));
create policy "public read project_photos" on public.project_photos for select using (true);
