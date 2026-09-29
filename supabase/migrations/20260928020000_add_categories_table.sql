create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (group_id, name)
);

create index if not exists idx_categories_group_id on public.categories using btree (group_id);

alter table public.categories enable row level security;

create policy "categories_group_members_all" on public.categories for all
  to authenticated using (is_group_member(group_id))
  with check (is_group_member(group_id));

grant select, insert, update, delete on public.categories to authenticated;
grant select, insert, update, delete on public.categories to service_role;
