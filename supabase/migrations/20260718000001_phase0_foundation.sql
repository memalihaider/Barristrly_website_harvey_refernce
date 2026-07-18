-- Phase 0: Foundation — auth extensions, orgs, RBAC, audit, settings, outbox
-- Barristrly marketplace-first SaaS

create extension if not exists "pgcrypto";

-- Roles
create type public.app_role as enum (
  'client',
  'lawyer',
  'firm_admin',
  'platform_admin'
);

create type public.organization_type as enum (
  'law_firm',
  'enterprise',
  'platform'
);

-- Organizations (tenants)
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  type public.organization_type not null default 'law_firm',
  jurisdiction_codes text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  display_name text,
  avatar_url text,
  phone text,
  locale text default 'en',
  organization_id uuid references public.organizations (id),
  is_anonymous_default boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.app_role not null,
  organization_id uuid references public.organizations (id),
  created_at timestamptz not null default now(),
  unique (user_id, role, organization_id)
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id),
  organization_id uuid references public.organizations (id),
  action text not null,
  resource_type text not null,
  resource_id text,
  metadata jsonb not null default '{}',
  ip inet,
  created_at timestamptz not null default now()
);

create table public.settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id),
  key text not null,
  value jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, key)
);

create table public.storage_objects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id),
  owner_id uuid references public.profiles (id),
  bucket text not null,
  path text not null,
  mime_type text,
  size_bytes bigint,
  checksum text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- Transactional outbox
create table public.outbox_events (
  id uuid primary key default gen_random_uuid(),
  aggregate_type text not null,
  aggregate_id text not null,
  event_type text not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

create index outbox_events_unprocessed_idx
  on public.outbox_events (created_at)
  where processed_at is null;

-- Helper: current user's org
create or replace function public.current_org_id()
returns uuid
language sql
stable
as $$
  select organization_id from public.profiles where id = auth.uid();
$$;

create or replace function public.has_role(check_role public.app_role)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = check_role
  );
$$;

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.audit_logs enable row level security;
alter table public.settings enable row level security;
alter table public.storage_objects enable row level security;
alter table public.outbox_events enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (id = auth.uid() or public.has_role('platform_admin'));

create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid());

create policy "orgs_member_select"
  on public.organizations for select
  using (
    id = public.current_org_id()
    or public.has_role('platform_admin')
  );

create policy "audit_insert_authenticated"
  on public.audit_logs for insert
  with check (auth.uid() is not null);

create policy "audit_select_admin"
  on public.audit_logs for select
  using (
    public.has_role('platform_admin')
    or public.has_role('firm_admin')
  );
