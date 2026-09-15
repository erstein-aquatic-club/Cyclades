-- Cyclades multi-trip foundation — additive / backwards-compatible migration.
-- This migration intentionally does not modify the existing RPC contracts or expense_people.

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  destination_label text not null,
  start_date date not null,
  end_date date not null,
  timezone text not null default 'Europe/Athens',
  currency text not null default 'EUR' check (currency ~ '^[A-Z]{3}$'),
  cover_image_url text,
  status text not null default 'planned' check (status in ('planned','active','completed','archived')),
  created_by uuid references public.app_users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create table if not exists public.trip_members (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid not null references public.app_users(id) on delete cascade,
  role text not null default 'viewer' check (role in ('owner','editor','viewer')),
  joined_at timestamptz not null default now(),
  unique (trip_id, user_id)
);

create index if not exists trip_members_user_trip_idx
  on public.trip_members(user_id, trip_id);

alter table public.expenses
  add column if not exists trip_id uuid references public.trips(id) on delete restrict;

create index if not exists expenses_trip_date_idx
  on public.expenses(trip_id, expense_date desc, created_at desc);

-- Keep the new tables inaccessible through the Data API for now.
-- The current app continues to use its token-validated SECURITY DEFINER RPC layer.
alter table public.trips enable row level security;
alter table public.trip_members enable row level security;
revoke all on public.trips from anon, authenticated;
revoke all on public.trip_members from anon, authenticated;

-- Seed the existing Cyclades trip idempotently. No generated UUID is hard-coded.
insert into public.trips (
  name, slug, destination_label, start_date, end_date, timezone, currency, status, created_by
)
select
  'Grèce 2026',
  'grece-2026',
  'Cyclades, Grèce',
  date '2026-09-09',
  date '2026-09-18',
  'Europe/Athens',
  'EUR',
  'active',
  (select id from public.app_users where lower(username) = 'francois' limit 1)
where not exists (select 1 from public.trips where slug = 'grece-2026');

-- Attach the existing application profiles to the trip.
insert into public.trip_members (trip_id, user_id, role)
select t.id, u.id,
       case when lower(u.username) = 'francois' then 'owner' else 'editor' end
from public.trips t
join public.app_users u on lower(u.username) in ('francois','onja')
where t.slug = 'grece-2026'
on conflict (trip_id, user_id) do nothing;

-- Backfill all current expenses. trip_id deliberately remains nullable during transition
-- so the legacy add-expense RPCs keep working until the V3 API is deployed.
update public.expenses e
set trip_id = t.id
from public.trips t
where t.slug = 'grece-2026'
  and e.trip_id is null;
