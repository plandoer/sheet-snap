create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  name text,
  photo text
);

alter table profiles enable row level security;
drop policy if exists "profiles_authenticated_read" on profiles;
create policy "profiles_authenticated_read" on profiles for select
  to authenticated using (true);

create or replace function public.handle_new_profile()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, email, name, photo)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'picture'
  ) on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists create_profile_on_user on auth.users;
create trigger create_profile_on_user after insert on auth.users
for each row execute function public.handle_new_profile();

insert into profiles (id, email, name, photo)
select id, email,
  coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name'),
  raw_user_meta_data->>'picture'
from auth.users
on conflict (id) do update set email = excluded.email;

create table if not exists expense_groups (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references expense_groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (group_id, user_id)
);

alter table expense_groups enable row level security;
alter table group_members enable row level security;

create or replace function public.is_group_member(p_group_id uuid, p_user_id uuid default auth.uid())
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from group_members
    where group_id = p_group_id and user_id = p_user_id
  );
$$;

drop policy if exists "group_members_read" on group_members;
create policy "group_members_read" on group_members for select
  to authenticated using (is_group_member(group_id));

drop policy if exists "groups_member_read" on expense_groups;
create policy "groups_member_read" on expense_groups for select
  to authenticated using (is_group_member(id));

drop policy if exists "groups_owner_insert" on expense_groups;
create policy "groups_owner_insert" on expense_groups for insert
  to authenticated with check (owner_id = (select auth.uid()));

drop policy if exists "groups_owner_update" on expense_groups;
create policy "groups_owner_update" on expense_groups for update
  to authenticated using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

drop policy if exists "groups_owner_delete" on expense_groups;
create policy "groups_owner_delete" on expense_groups for delete
  to authenticated using (
    owner_id = (select auth.uid())
    and (select count(*) from group_members where user_id = (select auth.uid())) > 1
  );

drop policy if exists "group_members_owner_insert" on group_members;
create policy "group_members_owner_insert" on group_members for insert
  to authenticated with check (
    exists (select 1 from expense_groups where id = group_id and owner_id = (select auth.uid()))
  );

create or replace function public.create_owner_membership()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into group_members (group_id, user_id)
  values (new.id, new.owner_id);
  return new;
end;
$$;

drop trigger if exists create_owner_membership_on_group on expense_groups;
create trigger create_owner_membership_on_group after insert on expense_groups
for each row execute function public.create_owner_membership();

insert into expense_groups (owner_id, name)
select u.id, 'Personal'
from auth.users u
where not exists (
  select 1 from group_members gm where gm.user_id = u.id
);

drop policy if exists "group_members_owner_delete" on group_members;
create policy "group_members_owner_delete" on group_members for delete
  to authenticated using (
    exists (
      select 1 from expense_groups
      where id = group_id
        and owner_id = (select auth.uid())
        and owner_id <> user_id
    )
  );

create or replace function public.prevent_owner_membership_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from expense_groups
    where id = old.group_id and owner_id = old.user_id
  ) then
    raise exception 'The group owner membership is protected' using errcode = '42501';
  end if;
  return old;
end;
$$;

drop trigger if exists protect_owner_membership on group_members;
create trigger protect_owner_membership before delete on group_members
for each row execute function prevent_owner_membership_change();

create or replace function public.create_personal_group()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into expense_groups (owner_id, name)
  values (new.id, 'Personal');
  return new;
end;
$$;

drop trigger if exists create_personal_group_on_user on auth.users;
create trigger create_personal_group_on_user after insert on auth.users
for each row execute function public.create_personal_group();

alter table expenses add column if not exists group_id uuid;

do $$
begin
  update expenses e
  set group_id = g.id
  from expense_groups g
  where e.group_id is null and g.owner_id = e.user_id;
  if exists (select 1 from expenses where group_id is null) then
    raise exception 'Every expense must belong to an expense group';
  end if;
end;
$$;

alter table expenses alter column group_id set not null;
alter table expenses drop constraint if exists expenses_group_id_fkey;
alter table expenses add constraint expenses_group_id_fkey
  foreign key (group_id) references expense_groups(id) on delete cascade;

drop policy if exists "owner_all" on expenses;
create policy "group_members_all" on expenses for all
  to authenticated using (is_group_member(group_id))
  with check (is_group_member(group_id));

drop policy if exists "sub_amounts_owner" on sub_amounts;
create policy "sub_amounts_group_members" on sub_amounts for all
  to authenticated using (exists (
    select 1 from expenses e where e.id = sub_amounts.expense_id and is_group_member(e.group_id)
  )) with check (exists (
    select 1 from expenses e where e.id = sub_amounts.expense_id and is_group_member(e.group_id)
  ));

drop policy if exists "each_shares_owner" on each_shares;
create policy "each_shares_group_members" on each_shares for all
  to authenticated using (exists (
    select 1 from expenses e where e.id = each_shares.expense_id and is_group_member(e.group_id)
  )) with check (exists (
    select 1 from expenses e where e.id = each_shares.expense_id and is_group_member(e.group_id)
  ));

drop function if exists create_expense_with_sub_amounts(uuid, timestamptz, text, text, text, text, text, uuid, boolean, boolean, jsonb, jsonb);
create or replace function create_expense_with_sub_amounts(
  p_user_id uuid, p_group_id uuid, p_date timestamptz, p_amount text,
  p_reason text, p_note text, p_category text, p_currency text, p_paid_by uuid,
  p_split_in_half boolean, p_excluded boolean, p_sub_amounts jsonb, p_each_shares jsonb
) returns json language plpgsql security definer set search_path = public as $$
declare v_expense expenses; v_item jsonb; v_person_id uuid;
begin
  if auth.uid() is null or auth.uid() <> p_user_id or not is_group_member(p_group_id, p_user_id) then
    raise exception 'Not authorized to create expenses in this group' using errcode = '42501';
  end if;
  if p_paid_by is not null and not exists (select 1 from persons where id = p_paid_by and user_id = p_user_id) then
    raise exception 'Invalid paid_by person for this user' using errcode = '42501';
  end if;
  insert into expenses (user_id, group_id, date, amount, reason, note, category, currency, paid_by, split_in_half, excluded)
  values (p_user_id, p_group_id, p_date, p_amount, p_reason, p_note, p_category, p_currency, p_paid_by, p_split_in_half, p_excluded)
  returning * into v_expense;
  for v_item in select * from jsonb_array_elements(coalesce(p_sub_amounts, '[]'::jsonb)) loop
    insert into sub_amounts (expense_id, amount, reason) values (v_expense.id, v_item->>'amount', nullif(v_item->>'reason', ''));
  end loop;
  for v_item in select * from jsonb_array_elements(coalesce(p_each_shares, '[]'::jsonb)) loop
    v_person_id := nullif(v_item->>'person_id', '')::uuid;
    if v_person_id is null or not exists (select 1 from persons where id = v_person_id and user_id = p_user_id) then
      raise exception 'Invalid each_share person for this user' using errcode = '42501';
    end if;
    insert into each_shares (expense_id, person_id, amount) values (v_expense.id, v_person_id, v_item->>'amount');
  end loop;
  return (select row_to_json(t) from (select v_expense.*, coalesce((select json_agg(s) from sub_amounts s where s.expense_id = v_expense.id), '[]'::json) sub_amounts, coalesce((select json_agg(s) from each_shares s where s.expense_id = v_expense.id), '[]'::json) each_shares) t);
end; $$;

drop function if exists update_expense_with_sub_amounts(uuid, uuid, timestamptz, text, text, text, text, text, uuid, boolean, boolean, jsonb, jsonb);
create or replace function update_expense_with_sub_amounts(
  p_user_id uuid, p_group_id uuid, p_expense_id uuid, p_date timestamptz, p_amount text,
  p_reason text, p_note text, p_category text, p_currency text, p_paid_by uuid,
  p_split_in_half boolean, p_excluded boolean, p_sub_amounts jsonb, p_each_shares jsonb
) returns json language plpgsql security definer set search_path = public as $$
declare v_expense expenses;
begin
  if auth.uid() is null or auth.uid() <> p_user_id or not is_group_member(p_group_id, p_user_id) then
    raise exception 'Not authorized to update expenses in this group' using errcode = '42501';
  end if;
  if p_paid_by is not null and not exists (select 1 from persons where id = p_paid_by and user_id = p_user_id) then
    raise exception 'Invalid paid_by person for this user' using errcode = '42501';
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
    where exists (select 1 from persons p where p.id = (item->>'person_id')::uuid and p.user_id = p_user_id);
  select * into v_expense from expenses where id = p_expense_id;
  return (select row_to_json(t) from (select v_expense.*, coalesce((select json_agg(s) from sub_amounts s where s.expense_id = v_expense.id), '[]'::json) sub_amounts, coalesce((select json_agg(s) from each_shares s where s.expense_id = v_expense.id), '[]'::json) each_shares) t);
end; $$;

create index if not exists idx_group_members_user_id on group_members(user_id);
create index if not exists idx_expenses_group_id on expenses(group_id);