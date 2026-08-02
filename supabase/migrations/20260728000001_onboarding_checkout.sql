-- Onboarding checkout: completion flag, profile fields, subscription requests

alter table public.users
  add column if not exists onboarding_completed boolean not null default false;

alter table public.users
  add column if not exists organization_id uuid;

-- Agency / org enrichment (create if missing, then enrich)
do $$
begin
  if not exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'organizations'
  ) then
    create table public.organizations (
      id uuid primary key default gen_random_uuid(),
      name text not null,
      slug text unique,
      type text not null default 'law_firm',
      jurisdiction_codes text[] default '{}',
      vat_id text,
      business_email text,
      phone text,
      employee_count integer,
      location text,
      metadata jsonb not null default '{}'::jsonb,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
    alter table public.organizations enable row level security;
  else
    alter table public.organizations add column if not exists vat_id text;
    alter table public.organizations add column if not exists business_email text;
    alter table public.organizations add column if not exists phone text;
    alter table public.organizations add column if not exists employee_count integer;
    alter table public.organizations add column if not exists location text;
    alter table public.organizations add column if not exists metadata jsonb not null default '{}'::jsonb;
  end if;
end $$;

-- Client / lawyer profile enrichment (app uses id = auth.uid())
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'client_profiles'
  ) then
    alter table public.client_profiles add column if not exists id_number text;
    alter table public.client_profiles add column if not exists full_name text;
  end if;

  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'lawyer_profiles'
  ) then
    alter table public.lawyer_profiles add column if not exists lawyer_license_id text;
    alter table public.lawyer_profiles add column if not exists phone text;
  end if;
end $$;

create table if not exists public.subscription_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  role text not null check (role = any (array['client','lawyer','firm_admin']::text[])),
  plan_id text not null,
  plan_snapshot jsonb not null default '{}'::jsonb,
  profile_snapshot jsonb not null default '{}'::jsonb,
  payment_method text not null check (payment_method = any (array['stripe','paypal','bank_transfer']::text[])),
  status text not null default 'pending_payment'
    check (status = any (array['pending_payment','pending_approval','active','rejected']::text[])),
  organization_id uuid,
  stripe_session_id text,
  admin_notes text,
  reviewed_by uuid references public.users (id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscription_requests_user_idx
  on public.subscription_requests (user_id);

create index if not exists subscription_requests_status_idx
  on public.subscription_requests (status);

alter table public.subscription_requests enable row level security;

drop policy if exists "subscription_requests_own_select" on public.subscription_requests;
create policy "subscription_requests_own_select"
  on public.subscription_requests for select
  using (user_id = auth.uid());

drop policy if exists "subscription_requests_own_insert" on public.subscription_requests;
create policy "subscription_requests_own_insert"
  on public.subscription_requests for insert
  with check (user_id = auth.uid());

drop policy if exists "subscription_requests_own_update" on public.subscription_requests;
create policy "subscription_requests_own_update"
  on public.subscription_requests for update
  using (user_id = auth.uid());

-- Super Admin can review all requests (app also uses service role)
drop policy if exists "subscription_requests_admin_all" on public.subscription_requests;
create policy "subscription_requests_admin_all"
  on public.subscription_requests for all
  using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid()
        and u.role in ('platform_admin', 'mediator')
    )
  )
  with check (
    exists (
      select 1 from public.users u
      where u.id = auth.uid()
        and u.role in ('platform_admin', 'mediator')
    )
  );
