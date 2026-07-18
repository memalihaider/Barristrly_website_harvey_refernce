-- Live-compatible documents MVP (matter = lead). Do not use phase4_7 migration that references matters/profiles.

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  uploaded_by uuid not null references public.users (id),
  title text not null,
  doc_type text not null default 'other',
  status text not null default 'active'
    check (status in ('active','archived')),
  version integer not null default 1,
  storage_path text not null,
  mime_type text not null default 'application/octet-stream',
  byte_size bigint not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists documents_lead_id_idx on public.documents (lead_id);
