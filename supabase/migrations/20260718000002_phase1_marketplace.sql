-- Phase 1: Marketplace MVP — lawyers, leads, COI, matching, booking, payments, meetings, consent

create type public.verification_status as enum (
  'pending', 'approved', 'rejected', 'suspended'
);

create type public.lead_status as enum (
  'open', 'matched', 'screening', 'consulting', 'engaged', 'completed', 'cancelled'
);

create type public.booking_status as enum (
  'requested', 'confirmed', 'cancelled', 'completed', 'no_show'
);

create type public.payment_status as enum (
  'pending', 'authorized', 'captured', 'held_escrow', 'released', 'refunded', 'failed'
);

create type public.consent_status as enum (
  'pending', 'granted', 'revoked'
);

create table public.lawyer_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  organization_id uuid references public.organizations (id),
  headline text,
  bio text,
  practice_areas text[] not null default '{}',
  jurisdictions text[] not null default '{}',
  languages text[] not null default '{en}',
  hourly_rate_cents integer,
  currency text not null default 'AED',
  rating numeric(3,2) default 0,
  years_experience integer default 0,
  verification_status public.verification_status not null default 'pending',
  subscription_tier text not null default 'starter',
  is_accepting_leads boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.client_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  preferred_language text default 'en',
  contact_preference text default 'platform',
  created_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles (id),
  status public.lead_status not null default 'open',
  raw_intake text,
  jurisdiction text,
  practice_area text,
  urgency text,
  structured_facts jsonb not null default '{}',
  is_anonymous boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.coi_screens (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  lawyer_id uuid not null references public.lawyer_profiles (id),
  party_hash text not null,
  result text not null check (result in ('cleared', 'conflicted', 'inconclusive')),
  details jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.lawyer_matches (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  lawyer_id uuid not null references public.lawyer_profiles (id),
  score numeric(5,4) not null,
  confidence numeric(5,4),
  rank integer not null,
  is_primary boolean not null default false,
  explanation jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique (lead_id, lawyer_id)
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads (id),
  client_id uuid not null references public.profiles (id),
  lawyer_id uuid not null references public.lawyer_profiles (id),
  status public.booking_status not null default 'requested',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  timezone text not null default 'Asia/Dubai',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings (id),
  payer_id uuid not null references public.profiles (id),
  amount_cents integer not null,
  currency text not null default 'AED',
  status public.payment_status not null default 'pending',
  stripe_payment_intent_id text,
  stripe_checkout_session_id text,
  kind text not null default 'consultation',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.escrow_accounts (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments (id),
  client_confirmed boolean not null default false,
  lawyer_confirmed boolean not null default false,
  released_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.meetings (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id),
  room_name text not null unique,
  mediasoup_router_id text,
  status text not null default 'scheduled',
  started_at timestamptz,
  ended_at timestamptz,
  transcript_storage_id uuid references public.storage_objects (id),
  created_at timestamptz not null default now()
);

create table public.dual_consent (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  client_status public.consent_status not null default 'pending',
  lawyer_status public.consent_status not null default 'pending',
  client_granted_at timestamptz,
  lawyer_granted_at timestamptz,
  created_at timestamptz not null default now(),
  unique (lead_id)
);

create table public.lawyer_approvals (
  id uuid primary key default gen_random_uuid(),
  lawyer_id uuid not null references public.lawyer_profiles (id),
  status public.verification_status not null default 'pending',
  reviewed_by uuid references public.profiles (id),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  lawyer_id uuid not null references public.lawyer_profiles (id),
  tier text not null,
  stripe_subscription_id text,
  status text not null default 'active',
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

alter table public.lawyer_profiles enable row level security;
alter table public.client_profiles enable row level security;
alter table public.leads enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.meetings enable row level security;
alter table public.dual_consent enable row level security;

create policy "lawyers_public_approved"
  on public.lawyer_profiles for select
  using (
    verification_status = 'approved'
    or user_id = auth.uid()
    or public.has_role('platform_admin')
  );

create policy "leads_owner_or_matched"
  on public.leads for select
  using (
    client_id = auth.uid()
    or public.has_role('platform_admin')
    or exists (
      select 1 from public.lawyer_matches m
      join public.lawyer_profiles lp on lp.id = m.lawyer_id
      where m.lead_id = leads.id and lp.user_id = auth.uid()
    )
  );
