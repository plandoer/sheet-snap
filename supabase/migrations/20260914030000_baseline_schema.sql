-- Baseline schema, consolidated from the project's earlier incremental
-- migrations now that the app is past its initial prototyping phase. This
-- file reflects only the current, final shape of the schema (tables,
-- indexes, functions, triggers, RLS policies and grants) with no
-- backward-compatible/legacy steps.

-- ==============================
-- Tables
-- ==============================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  name text,
  photo text
);

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  invitation_token uuid unique default gen_random_uuid()
);

create table if not exists public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (group_id, user_id)
);

create table if not exists public.persons (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (group_id, name)
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  group_id uuid not null references public.groups(id) on delete cascade,
  date timestamptz not null,
  amount text not null,
  reason text,
  note text,
  category text,
  currency text not null default '',
  paid_by uuid references public.persons(id) on delete set null,
  split_in_half boolean not null default false,
  excluded boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_expenses_group_id on public.expenses using btree (group_id);
create index if not exists idx_expenses_paid_by on public.expenses using btree (paid_by);
create index if not exists idx_group_members_user_id on public.group_members using btree (user_id);
create index if not exists idx_persons_group_id on public.persons using btree (group_id);

create table if not exists public.sub_amounts (
  id uuid primary key default gen_random_uuid(),
  expense_id uuid not null references public.expenses(id) on delete cascade,
  amount text not null,
  reason text
);

create index if not exists idx_sub_amounts_expense_id on public.sub_amounts using btree (expense_id);

create table if not exists public.each_shares (
  id uuid primary key default gen_random_uuid(),
  expense_id uuid not null references public.expenses(id) on delete cascade,
  person_id uuid not null references public.persons(id) on delete cascade,
  amount text not null,
  unique (expense_id, person_id)
);

create index if not exists idx_each_shares_expense_id on public.each_shares using btree (expense_id);
create index if not exists idx_each_shares_person_id on public.each_shares using btree (person_id);

-- ==============================
-- Functions & triggers
-- ==============================

create or replace function public.is_group_member(p_group_id uuid, p_user_id uuid default auth.uid())
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from group_members
    where group_id = p_group_id and user_id = p_user_id
  );
$$;

create or replace function public.handle_new_profile()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name, photo)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'picture'
  )
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists create_profile_on_user on auth.users;
create trigger create_profile_on_user after insert on auth.users
for each row execute function public.handle_new_profile();

create or replace function public.create_owner_membership()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.group_members (group_id, user_id)
  values (new.id, new.owner_id);
  return new;
end;
$$;

drop trigger if exists create_owner_membership_on_group on public.groups;
create trigger create_owner_membership_on_group after insert on public.groups
for each row execute function public.create_owner_membership();

create or replace function public.create_personal_group()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.groups (owner_id, name)
  values (new.id, 'Personal');
  return new;
end;
$$;

drop trigger if exists create_personal_group_on_user on auth.users;
create trigger create_personal_group_on_user after insert on auth.users
for each row execute function public.create_personal_group();

create or replace function public.prevent_owner_membership_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.groups
    where id = old.group_id and owner_id = old.user_id
  ) then
    raise exception 'The group owner membership is protected' using errcode = '42501';
  end if;
  return old;
end;
$$;

drop trigger if exists protect_owner_membership on public.group_members;
create trigger protect_owner_membership before delete on public.group_members
for each row execute function public.prevent_owner_membership_change();

-- Returns the group's existing invitation token, generating one on first use.
-- Only the group owner may call this.
create or replace function public.get_or_create_group_invitation_token(p_group_id uuid)
returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_token uuid;
begin
  if not exists (
    select 1 from groups where id = p_group_id and owner_id = auth.uid()
  ) then
    raise exception 'Only the group owner can generate an invitation link' using errcode = '42501';
  end if;

  select invitation_token into v_token from groups where id = p_group_id;

  if v_token is null then
    v_token := gen_random_uuid();
    update groups set invitation_token = v_token where id = p_group_id;
  end if;

  return v_token;
end;
$$;

-- Lets any authenticated user preview the target group before joining, since
-- the "groups_member_read" policy would otherwise hide it from non-members.
create or replace function public.get_group_by_invitation_token(p_token uuid)
returns table (id uuid, name text)
language sql stable security definer set search_path = public as $$
  select g.id, g.name
  from groups g
  where g.invitation_token = p_token;
$$;

grant execute on function public.get_group_by_invitation_token(uuid) to authenticated;

create or replace function public.join_group_by_invitation_token(p_token uuid)
returns table (id uuid, name text)
language plpgsql security definer set search_path = public as $$
declare
  v_group_id uuid;
  v_group_name text;
begin
  select g.id, g.name into v_group_id, v_group_name
  from groups g
  where g.invitation_token = p_token;

  if v_group_id is null then
    raise exception 'Invalid invitation link' using errcode = 'P0002';
  end if;

  insert into group_members (group_id, user_id)
  values (v_group_id, auth.uid())
  on conflict (group_id, user_id) do nothing;

  return query select v_group_id, v_group_name;
end;
$$;

grant execute on function public.join_group_by_invitation_token(uuid) to authenticated;

create or replace function public.create_expense_with_sub_amounts(
  p_user_id uuid, p_group_id uuid, p_date timestamptz, p_amount text,
  p_reason text, p_note text, p_category text, p_currency text, p_paid_by uuid,
  p_split_in_half boolean, p_excluded boolean, p_sub_amounts jsonb, p_each_shares jsonb
) returns json language plpgsql security definer set search_path = public as $$
declare v_expense expenses; v_item jsonb; v_person_id uuid;
begin
  if auth.uid() is null or auth.uid() <> p_user_id or not is_group_member(p_group_id, p_user_id) then
    raise exception 'Not authorized to create expenses in this group' using errcode = '42501';
  end if;
  if p_paid_by is not null and not exists (select 1 from persons where id = p_paid_by and group_id = p_group_id) then
    raise exception 'Invalid paid_by person for this group' using errcode = '42501';
  end if;
  insert into expenses (user_id, group_id, date, amount, reason, note, category, currency, paid_by, split_in_half, excluded)
  values (p_user_id, p_group_id, p_date, p_amount, p_reason, p_note, p_category, p_currency, p_paid_by, p_split_in_half, p_excluded)
  returning * into v_expense;
  for v_item in select * from jsonb_array_elements(coalesce(p_sub_amounts, '[]'::jsonb)) loop
    insert into sub_amounts (expense_id, amount, reason) values (v_expense.id, v_item->>'amount', nullif(v_item->>'reason', ''));
  end loop;
  for v_item in select * from jsonb_array_elements(coalesce(p_each_shares, '[]'::jsonb)) loop
    v_person_id := nullif(v_item->>'person_id', '')::uuid;
    if v_person_id is null or not exists (select 1 from persons where id = v_person_id and group_id = p_group_id) then
      raise exception 'Invalid each_share person for this group' using errcode = '42501';
    end if;
    insert into each_shares (expense_id, person_id, amount) values (v_expense.id, v_person_id, v_item->>'amount');
  end loop;
  return (select row_to_json(t) from (select v_expense.*, coalesce((select json_agg(s) from sub_amounts s where s.expense_id = v_expense.id), '[]'::json) sub_amounts, coalesce((select json_agg(s) from each_shares s where s.expense_id = v_expense.id), '[]'::json) each_shares) t);
end; $$;

create or replace function public.update_expense_with_sub_amounts(
  p_user_id uuid, p_group_id uuid, p_expense_id uuid, p_date timestamptz, p_amount text,
  p_reason text, p_note text, p_category text, p_currency text, p_paid_by uuid,
  p_split_in_half boolean, p_excluded boolean, p_sub_amounts jsonb, p_each_shares jsonb
) returns json language plpgsql security definer set search_path = public as $$
declare v_expense expenses;
begin
  if auth.uid() is null or auth.uid() <> p_user_id or not is_group_member(p_group_id, p_user_id) then
    raise exception 'Not authorized to update expenses in this group' using errcode = '42501';
  end if;
  if p_paid_by is not null and not exists (select 1 from persons where id = p_paid_by and group_id = p_group_id) then
    raise exception 'Invalid paid_by person for this group' using errcode = '42501';
  end if;
  update expenses set date = p_date, amount = p_amount, reason = p_reason, note = p_note, category = p_category, currency = p_currency, paid_by = p_paid_by, split_in_half = p_split_in_half, excluded = p_excluded
  where id = p_expense_id and group_id = p_group_id;
  if not found then raise exception 'Expense not found' using errcode = 'P0002'; end if;
  delete from sub_amounts where expense_id = p_expense_id;
  delete from each_shares where expense_id = p_expense_id;
  insert into sub_amounts (expense_id, amount, reason)
    select p_expense_id, item->>'amount', nullif(item->>'reason', '') from jsonb_array_elements(coalesce(p_sub_amounts, '[]'::jsonb)) item;
  insert into each_shares (expense_id, person_id, amount)
    select p_expense_id, (item->>'person_id')::uuid, item->>'amount' from jsonb_array_elements(coalesce(p_each_shares, '[]'::jsonb)) item
    where exists (select 1 from persons p where p.id = (item->>'person_id')::uuid and p.group_id = p_group_id);
  select * into v_expense from expenses where id = p_expense_id;
  return (select row_to_json(t) from (select v_expense.*, coalesce((select json_agg(s) from sub_amounts s where s.expense_id = v_expense.id), '[]'::json) sub_amounts, coalesce((select json_agg(s) from each_shares s where s.expense_id = v_expense.id), '[]'::json) each_shares) t);
end; $$;

-- ==============================
-- Row level security
-- ==============================

alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.persons enable row level security;
alter table public.expenses enable row level security;
alter table public.sub_amounts enable row level security;
alter table public.each_shares enable row level security;

create policy "profiles_authenticated_read" on public.profiles for select
  to authenticated using (true);

create policy "groups_member_read" on public.groups for select
  to authenticated using (is_group_member(id));

create policy "groups_owner_insert" on public.groups for insert
  to authenticated with check (owner_id = (select auth.uid()));

create policy "groups_owner_update" on public.groups for update
  to authenticated using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "groups_owner_delete" on public.groups for delete
  to authenticated using (
    owner_id = (select auth.uid())
    and (select count(*) from group_members where user_id = (select auth.uid())) > 1
  );

create policy "group_members_read" on public.group_members for select
  to authenticated using (is_group_member(group_id));

create policy "group_members_owner_insert" on public.group_members for insert
  to authenticated with check (
    exists (select 1 from groups where id = group_id and owner_id = (select auth.uid()))
  );

create policy "group_members_owner_delete" on public.group_members for delete
  to authenticated using (
    exists (
      select 1 from groups
      where id = group_id
        and owner_id = (select auth.uid())
        and owner_id <> user_id
    )
  );

create policy "persons_group_members_all" on public.persons for all
  to authenticated using (is_group_member(group_id))
  with check (is_group_member(group_id));

create policy "group_members_all" on public.expenses for all
  to authenticated using (is_group_member(group_id))
  with check (is_group_member(group_id));

create policy "sub_amounts_group_members" on public.sub_amounts for all
  to authenticated using (exists (
    select 1 from expenses e where e.id = sub_amounts.expense_id and is_group_member(e.group_id)
  )) with check (exists (
    select 1 from expenses e where e.id = sub_amounts.expense_id and is_group_member(e.group_id)
  ));

create policy "each_shares_group_members" on public.each_shares
  to authenticated using (exists (
    select 1 from expenses e where e.id = each_shares.expense_id and is_group_member(e.group_id)
  )) with check (exists (
    select 1 from expenses e where e.id = each_shares.expense_id and is_group_member(e.group_id)
  ));

-- ==============================
-- Data API grants
--
-- Supabase's local dev stack no longer grants default table privileges to
-- anon/authenticated/service_role on new/existing public tables (see
-- https://supabase.com/changelog/45329). RLS policies alone are not enough;
-- PostgREST also requires an explicit GRANT before it can reach a table.
-- ==============================

grant select, insert, update, delete on table
  public.profiles,
  public.groups,
  public.group_members,
  public.expenses,
  public.sub_amounts,
  public.each_shares,
  public.persons
to authenticated, service_role;

-- Keep future tables in public reachable via the Data API without needing a
-- manual grant every time, matching the pre-breaking-change default.
alter default privileges for role postgres in schema public
  grant select, insert, update, delete on tables to authenticated, service_role;

alter default privileges for role postgres in schema public
  grant usage, select on sequences to authenticated, service_role;
