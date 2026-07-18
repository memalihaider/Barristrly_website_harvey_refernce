-- Phase 2–3: Client portal + CRM practice core

create type public.matter_status as enum (
  'intake', 'active', 'on_hold', 'closed', 'archived'
);

create table public.matters (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id),
  lead_id uuid references public.leads (id),
  client_id uuid not null references public.profiles (id),
  lawyer_id uuid references public.lawyer_profiles (id),
  title text not null,
  status public.matter_status not null default 'intake',
  practice_area text,
  jurisdiction text,
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.matter_messages (
  id uuid primary key default gen_random_uuid(),
  matter_id uuid not null references public.matters (id) on delete cascade,
  sender_id uuid not null references public.profiles (id),
  body text not null,
  created_at timestamptz not null default now()
);

create table public.matter_timeline (
  id uuid primary key default gen_random_uuid(),
  matter_id uuid not null references public.matters (id) on delete cascade,
  actor_id uuid references public.profiles (id),
  event_type text not null,
  summary text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id),
  owner_id uuid not null references public.profiles (id),
  matter_id uuid references public.matters (id),
  booking_id uuid references public.bookings (id),
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  channel text not null default 'email',
  template_key text not null,
  payload jsonb not null default '{}',
  status text not null default 'pending',
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.crm_clients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id),
  profile_id uuid references public.profiles (id),
  display_name text not null,
  email text,
  phone text,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.matters enable row level security;
alter table public.matter_messages enable row level security;
alter table public.notifications enable row level security;

create policy "matters_participants"
  on public.matters for select
  using (
    client_id = auth.uid()
    or public.has_role('platform_admin')
    or exists (
      select 1 from public.lawyer_profiles lp
      where lp.id = matters.lawyer_id and lp.user_id = auth.uid()
    )
  );
