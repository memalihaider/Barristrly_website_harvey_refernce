-- Inbound inquiries from public marketing forms (request demo, contact, etc.)
-- Inserted server-side with the service role; reviewed by Super Admin.

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'request_demo',
  name text not null,
  email text not null,
  organization text,
  role text,
  country text,
  message text,
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'new'
    check (status = any (array['new','contacted','closed','spam']::text[])),
  admin_notes text,
  handled_by uuid references public.users (id),
  handled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists inquiries_status_idx on public.inquiries (status);
create index if not exists inquiries_created_idx on public.inquiries (created_at desc);

alter table public.inquiries enable row level security;

-- No public policies: anonymous visitors submit via the API (service role).
drop policy if exists "inquiries_admin_all" on public.inquiries;
create policy "inquiries_admin_all"
  on public.inquiries for all
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
