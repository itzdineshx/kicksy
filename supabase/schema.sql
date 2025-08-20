-- Supabase schema for Kiccksy
-- Run this in the SQL editor of your Supabase project

-- Extensions
create extension if not exists pgcrypto;

-- Tables

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  venue text,
  genre text,
  base_price numeric(10,2) default 0,
  capacity integer default 0,
  banner_url text,
  description text,
  is_published boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.segments (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  share numeric(6,3) default 0,
  created_at timestamptz default now()
);

create table if not exists public.pricing_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  priority integer not null default 100,
  genre text default '',
  seat_type text default '',
  date_before_days integer default 0,
  price_multiplier numeric(6,3) not null default 1.0,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.elasticity (
  key text primary key,
  price_elasticity numeric(6,3) default -1.5,
  demand_elasticity numeric(6,3) default -1.2,
  updated_at timestamptz default now()
);

create table if not exists public.historical_demand (
  id bigserial primary key,
  for_date date not null,
  demand integer not null,
  created_at timestamptz default now()
);

create table if not exists public.forecasts (
  id bigserial primary key,
  for_date date unique not null,
  demand integer not null,
  confidence numeric(5,3) default 0.7,
  created_at timestamptz default now()
);

create table if not exists public.price_tests (
  id bigserial primary key,
  base_price numeric(10,2) not null,
  new_price numeric(10,2) not null,
  base_demand integer not null,
  new_demand integer not null,
  revenue_change numeric(8,3) null,
  demand_change numeric(8,3) null,
  elasticity numeric(6,3) null,
  created_at timestamptz default now()
);

create table if not exists public.pricing_recommendations (
  id bigserial primary key,
  event_id text not null,
  seat_type text not null,
  recommended_price numeric(10,2) not null,
  expected_demand numeric(12,3),
  expected_revenue numeric(14,3),
  model_name text,
  features jsonb,
  created_at timestamptz default now(),
  unique(event_id, seat_type, created_at)
);

create table if not exists public.price_overrides (
  id bigserial primary key,
  event_id text not null,
  seat_type text not null,
  applied_price numeric(10,2) not null,
  applied_by text,
  reason text,
  created_at timestamptz default now(),
  unique(event_id, seat_type)
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  event_id text,
  event_title text,
  event_date text,
  event_time text,
  location text,
  amount numeric(10,2),
  payload jsonb,
  is_paid boolean default false,
  created_at timestamptz default now()
);

-- Function: daily booking counts
create or replace function public.daily_booking_counts()
returns table (date date, count bigint) language sql stable as $$
  select date_trunc('day', created_at)::date as date, count(*)
  from public.bookings
  group by 1
  order by 1;
$$;

-- Row Level Security
alter table public.events enable row level security;
alter table public.segments enable row level security;
alter table public.pricing_rules enable row level security;
alter table public.elasticity enable row level security;
alter table public.historical_demand enable row level security;
alter table public.forecasts enable row level security;
alter table public.price_tests enable row level security;
alter table public.bookings enable row level security;
alter table public.pricing_recommendations enable row level security;
alter table public.price_overrides enable row level security;

-- Policies (anon read, inserts allowed for specific tables). Adjust as needed for production.
do $$ begin
  -- events: read all
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='events' and policyname='Allow read for authenticated and anon'
  ) then
    create policy "Allow read for authenticated and anon" on public.events
      for select to anon, authenticated using (true);
  end if;

  -- bookings: open policies for dev (adjust for production)
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='bookings' and policyname='Bookings select (dev open)'
  ) then
    create policy "Bookings select (dev open)" on public.bookings
      for select to anon, authenticated using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='bookings' and policyname='Bookings insert (dev open)'
  ) then
    create policy "Bookings insert (dev open)" on public.bookings
      for insert to anon, authenticated with check (true);
  end if;

  -- price_tests, forecasts, historical_demand, pricing_rules, segments, elasticity: open read; insert/update only to authenticated
  perform pg_sleep(0);
end $$;

-- Open read policies
create policy if not exists "Read forecasts" on public.forecasts for select to anon, authenticated using (true);
create policy if not exists "Read historical_demand" on public.historical_demand for select to anon, authenticated using (true);
create policy if not exists "Read pricing_rules" on public.pricing_rules for select to anon, authenticated using (true);
create policy if not exists "Read segments" on public.segments for select to anon, authenticated using (true);
create policy if not exists "Read elasticity" on public.elasticity for select to anon, authenticated using (true);
create policy if not exists "Read price_tests" on public.price_tests for select to anon, authenticated using (true);
create policy if not exists "Read pricing_recommendations" on public.pricing_recommendations for select to anon, authenticated using (true);
create policy if not exists "Read price_overrides" on public.price_overrides for select to anon, authenticated using (true);

-- Mutations for authenticated only (you can widen to anon in dev if needed)
create policy if not exists "Modify forecasts (auth)" on public.forecasts for insert to authenticated with check (true);
create policy if not exists "Modify forecasts up (auth)" on public.forecasts for update to authenticated using (true) with check (true);

create policy if not exists "Insert historical_demand (auth)" on public.historical_demand for insert to authenticated with check (true);

create policy if not exists "Modify pricing_rules (auth)" on public.pricing_rules for all to authenticated using (true) with check (true);

create policy if not exists "Modify segments (auth)" on public.segments for all to authenticated using (true) with check (true);

create policy if not exists "Modify elasticity (auth)" on public.elasticity for insert to authenticated with check (true);
create policy if not exists "Update elasticity (auth)" on public.elasticity for update to authenticated using (true) with check (true);

create policy if not exists "Insert price_tests (auth)" on public.price_tests for insert to authenticated with check (true);
create policy if not exists "Insert pricing_recommendations (auth)" on public.pricing_recommendations for insert to authenticated with check (true);
create policy if not exists "Upsert price_overrides (auth)" on public.price_overrides for insert to authenticated with check (true);
create policy if not exists "Update price_overrides (auth)" on public.price_overrides for update to authenticated using (true) with check (true);

-- Realtime: enable on tables
-- In the Supabase dashboard go to Database > Replication > Configure and enable for tables you need, e.g., bookings


