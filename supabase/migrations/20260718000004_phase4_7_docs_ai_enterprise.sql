-- Phase 4–7: Documents, AI, litigation/CLM, enterprise hooks

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  matter_id uuid references public.matters (id),
  organization_id uuid references public.organizations (id),
  storage_id uuid references public.storage_objects (id),
  title text not null,
  doc_type text,
  version integer not null default 1,
  status text not null default 'draft',
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.document_versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents (id) on delete cascade,
  version integer not null,
  storage_id uuid references public.storage_objects (id),
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  unique (document_id, version)
);

create table public.esign_requests (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents (id),
  status text not null default 'pending',
  signers jsonb not null default '[]',
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.ai_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id),
  matter_id uuid references public.matters (id),
  agent_key text not null,
  status text not null default 'active',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.ai_sessions (id) on delete cascade,
  role text not null,
  content text not null,
  citations jsonb not null default '[]',
  token_usage jsonb,
  created_at timestamptz not null default now()
);

create table public.ai_prompt_versions (
  id uuid primary key default gen_random_uuid(),
  prompt_key text not null,
  version integer not null,
  body text not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  unique (prompt_key, version)
);

create table public.kg_entities (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  label text not null,
  canonical_id text,
  properties jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.kg_edges (
  id uuid primary key default gen_random_uuid(),
  from_entity uuid not null references public.kg_entities (id) on delete cascade,
  to_entity uuid not null references public.kg_entities (id) on delete cascade,
  relation text not null,
  properties jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.court_cases (
  id uuid primary key default gen_random_uuid(),
  matter_id uuid not null references public.matters (id),
  case_number text,
  court_name text,
  jurisdiction text,
  status text not null default 'open',
  next_hearing_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.court_deadlines (
  id uuid primary key default gen_random_uuid(),
  court_case_id uuid not null references public.court_cases (id) on delete cascade,
  title text not null,
  due_at timestamptz not null,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.contracts (
  id uuid primary key default gen_random_uuid(),
  matter_id uuid references public.matters (id),
  organization_id uuid references public.organizations (id),
  title text not null,
  status text not null default 'draft',
  counterparty text,
  effective_date date,
  expiry_date date,
  created_at timestamptz not null default now()
);

create table public.contract_obligations (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts (id) on delete cascade,
  description text not null,
  due_at timestamptz,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table public.webhook_endpoints (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id),
  url text not null,
  secret text not null,
  event_types text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.webhook_deliveries (
  id uuid primary key default gen_random_uuid(),
  endpoint_id uuid not null references public.webhook_endpoints (id) on delete cascade,
  event_type text not null,
  payload jsonb not null,
  status text not null default 'pending',
  attempts integer not null default 0,
  last_error text,
  created_at timestamptz not null default now()
);

create table public.accounting_entries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id),
  entry_type text not null,
  amount_cents integer not null,
  currency text not null default 'AED',
  reference_type text,
  reference_id uuid,
  created_at timestamptz not null default now()
);

create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  user_id uuid references public.profiles (id),
  organization_id uuid references public.organizations (id),
  properties jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.documents enable row level security;
alter table public.ai_sessions enable row level security;
alter table public.court_cases enable row level security;
alter table public.contracts enable row level security;
alter table public.webhook_endpoints enable row level security;
