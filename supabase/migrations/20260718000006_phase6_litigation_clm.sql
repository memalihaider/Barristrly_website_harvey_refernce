-- Phase 6 thin litigation + CLM (matter = lead)

create table if not exists public.matter_deadlines (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  title text not null,
  due_at timestamptz not null,
  status text not null default 'open'
    check (status in ('open','done','missed','cancelled')),
  kind text not null default 'general'
    check (kind in ('hearing','filing','limitation','obligation','general')),
  created_by uuid not null references public.users (id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  title text not null,
  status text not null default 'draft'
    check (status in ('draft','in_review','executed','expired','terminated')),
  counterparty text not null default '',
  effective_on date,
  expires_on date,
  document_id uuid references public.documents (id) on delete set null,
  created_by uuid not null references public.users (id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
