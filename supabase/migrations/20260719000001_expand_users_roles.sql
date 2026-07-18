-- Align users.role with app AppRole (platform_admin, firm_admin)

alter table public.users drop constraint if exists users_role_check;
alter table public.users add constraint users_role_check
  check (role = any (array['client','lawyer','mediator','platform_admin','firm_admin']::text[]));
