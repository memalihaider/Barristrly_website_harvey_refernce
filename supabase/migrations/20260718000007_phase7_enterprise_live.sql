-- Phase 7 thin enterprise: analytics_events (no organizations / profiles)

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  user_id uuid references public.users (id) on delete set null,
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists analytics_events_created_at_idx
  on public.analytics_events (created_at desc);

create index if not exists analytics_events_event_name_idx
  on public.analytics_events (event_name);

create index if not exists analytics_events_user_id_idx
  on public.analytics_events (user_id);

alter table public.analytics_events enable row level security;

-- Authenticated users may insert events for themselves (or anonymous user_id null)
drop policy if exists "analytics_events_insert_own" on public.analytics_events;
create policy "analytics_events_insert_own"
  on public.analytics_events
  for insert
  to authenticated
  with check (user_id is null or user_id = auth.uid());

-- Users can read their own events; platform-wide reads use service role in admin APIs
drop policy if exists "analytics_events_select_own" on public.analytics_events;
create policy "analytics_events_select_own"
  on public.analytics_events
  for select
  to authenticated
  using (user_id = auth.uid());
