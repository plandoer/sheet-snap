-- Single consolidated schema for Sheet Snap.
-- Rewrite this file (then `supabase db reset`) while the project is in development.

-- Tables ---------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  name text,
  photo text
);

create table public.groups (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  invitation_token uuid unique default gen_random_uuid()
);

create table public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (group_id, user_id)
);
create index idx_group_members_user_id on public.group_members(user_id);

create table public.persons (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (group_id, name),
  unique (id, group_id)
);
create index idx_persons_group_id on public.persons(group_id);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (group_id, name),
  unique (id, group_id)
);
create index idx_categories_group_id on public.categories(group_id);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  group_id uuid not null references public.groups(id) on delete cascade,
  date timestamptz not null,
  amount text not null,
  reason text,
  note text,
  currency text not null default '',
  paid_by uuid not null,
  category_id uuid not null,
  excluded boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint expenses_paid_by_group_fkey
    foreign key (paid_by, group_id) references public.persons(id, group_id) on delete restrict,
  constraint expenses_category_group_fkey
    foreign key (category_id, group_id) references public.categories(id, group_id) on delete restrict
);
create index idx_expenses_group_id on public.expenses(group_id);
create index idx_expenses_group_id_is_active on public.expenses(group_id, is_active);
create index idx_expenses_paid_by on public.expenses(paid_by);
create index idx_expenses_category_id on public.expenses(category_id);

create table public.sub_amounts (
  id uuid primary key default gen_random_uuid(),
  expense_id uuid not null references public.expenses(id) on delete cascade,
  amount text not null,
  reason text
);
create index idx_sub_amounts_expense_id on public.sub_amounts(expense_id);

create table public.each_shares (
  id uuid primary key default gen_random_uuid(),
  expense_id uuid not null references public.expenses(id) on delete cascade,
  person_id uuid not null references public.persons(id) on delete restrict,
  amount text not null,
  unique (expense_id, person_id)
);
create index idx_each_shares_expense_id on public.each_shares(expense_id);
create index idx_each_shares_person_id on public.each_shares(person_id);

-- Triggers -------------------------------------------------------------------

create function public.prevent_group_scope_change()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.group_id is distinct from old.group_id then
    raise exception 'A row cannot be moved between groups' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger prevent_person_group_change before update on public.persons
for each row execute function public.prevent_group_scope_change();

create trigger prevent_category_group_change before update on public.categories
for each row execute function public.prevent_group_scope_change();

create function public.prevent_expense_ownership_change()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.group_id is distinct from old.group_id or new.user_id is distinct from old.user_id then
    raise exception 'Expense ownership cannot be changed' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger prevent_expense_ownership_change before update on public.expenses
for each row execute function public.prevent_expense_ownership_change();

create function public.enforce_each_share_same_group()
returns trigger language plpgsql set search_path = public as $$
begin
  if not exists (
    select 1
    from public.expenses e
    join public.persons p on p.id = new.person_id and p.group_id = e.group_id
    where e.id = new.expense_id
  ) then
    raise exception 'Each-share person must belong to the expense group' using errcode = '23503';
  end if;
  return new;
end;
$$;

create trigger enforce_each_share_same_group before insert or update on public.each_shares
for each row execute function public.enforce_each_share_same_group();

-- Helper functions -----------------------------------------------------------

create function public.is_group_member(p_group_id uuid, p_user_id uuid default auth.uid())
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from group_members
    where group_id = p_group_id and user_id = p_user_id
  );
$$;

-- Triggers -------------------------------------------------------------------

create function public.handle_new_profile()
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

create trigger create_profile_on_user after insert on auth.users
for each row execute function public.handle_new_profile();

create function public.create_personal_group()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.groups (owner_id, name)
  values (new.id, 'Personal');
  return new;
end;
$$;

create trigger create_personal_group_on_user after insert on auth.users
for each row execute function public.create_personal_group();

create function public.create_owner_membership()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.group_members (group_id, user_id)
  values (new.id, new.owner_id);
  return new;
end;
$$;

create trigger create_owner_membership_on_group after insert on public.groups
for each row execute function public.create_owner_membership();

create function public.prevent_owner_membership_change()
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

create trigger protect_owner_membership before delete on public.group_members
for each row execute function public.prevent_owner_membership_change();

create function public.prevent_last_group_deletion()
returns trigger language plpgsql set search_path = public as $$
declare
  v_group_count integer;
begin
  if auth.uid() is null or auth.uid() <> old.owner_id then
    return old;
  end if;

  perform pg_advisory_xact_lock(hashtextextended(old.owner_id::text, 0));

  select count(*) into v_group_count
  from public.group_members
  where user_id = old.owner_id;

  if v_group_count <= 1 then
    raise exception 'Cannot delete your last expense group' using errcode = 'P0001';
  end if;

  return old;
end;
$$;

create trigger prevent_last_group_deletion_on_group before delete on public.groups
for each row execute function public.prevent_last_group_deletion();

-- RPCs -----------------------------------------------------------------------

create function public.get_group_by_invitation_token(p_token uuid)
returns table (id uuid, name text)
language plpgsql stable security definer set search_path = public as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication is required to look up an invitation' using errcode = '42501';
  end if;

  return query
  select g.id, g.name
  from groups g
  where g.invitation_token = p_token;
end;
$$;

create function public.get_or_create_group_invitation_token(p_group_id uuid)
returns uuid language plpgsql security definer set search_path = public as $$
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

create function public.join_group_by_invitation_token(p_token uuid)
returns table (id uuid, name text)
language plpgsql security definer set search_path = public as $$
declare
  v_group_id uuid;
  v_group_name text;
begin
  if auth.uid() is null then
    raise exception 'Authentication is required to join a group' using errcode = '42501';
  end if;

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

create function public.delete_group(p_group_id uuid)
returns void language plpgsql set search_path = public as $$
declare
  v_owner_id uuid;
  v_group_count integer;
begin
  if auth.uid() is null then
    raise exception 'Not authorized to delete expense group' using errcode = '42501';
  end if;

  select owner_id into v_owner_id
  from public.groups
  where id = p_group_id
  for update;

  if v_owner_id is null or v_owner_id <> auth.uid() then
    raise exception 'Not authorized to delete expense group' using errcode = '42501';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(v_owner_id::text, 0));

  select count(*) into v_group_count
  from public.group_members
  where user_id = v_owner_id;

  if v_group_count <= 1 then
    raise exception 'Cannot delete your last expense group' using errcode = 'P0001';
  end if;

  delete from public.groups where id = p_group_id;
end;
$$;

create function public.create_person_with_expense_shares(p_group_id uuid, p_name text)
returns public.persons language plpgsql set search_path = public as $$
declare
  v_person persons;
  v_expense record;
  v_count integer;
  v_total_cents bigint;
  v_share_cents bigint;
  v_remainder_cents bigint;
begin
  if auth.uid() is null or not is_group_member(p_group_id) then
    raise exception 'Not authorized to create persons in this group' using errcode = '42501';
  end if;

  insert into persons (group_id, name)
  values (p_group_id, btrim(p_name))
  returning * into v_person;

  -- Re-split every active, evenly-shared expense to include the new person.
  for v_expense in
    select e.id, e.amount, e.paid_by
    from expenses e
    where e.group_id = p_group_id
      and e.is_active
      and btrim(e.amount) ~ '^([0-9]+([.][0-9]*)?|[.][0-9]+)$'
      and exists (select 1 from each_shares s where s.expense_id = e.id)
    for update
  loop
    insert into each_shares (expense_id, person_id, amount)
    values (v_expense.id, v_person.id, '0');

    select count(*) into v_count from each_shares where expense_id = v_expense.id;

    v_total_cents := round(btrim(v_expense.amount)::numeric * 100);
    v_share_cents := round(v_total_cents::numeric / v_count);
    v_remainder_cents := v_total_cents - v_share_cents * v_count;

    update each_shares
    set amount = to_char(
      (v_share_cents + case when person_id = v_expense.paid_by then v_remainder_cents else 0 end)::numeric / 100,
      'FM999999999990.00'
    )
    where expense_id = v_expense.id;
  end loop;

  return v_person;
end;
$$;

create function public.create_expense_with_sub_amounts(
  p_user_id uuid, p_group_id uuid, p_date timestamptz, p_amount text,
  p_reason text, p_note text, p_category_id uuid, p_currency text,
  p_paid_by uuid, p_excluded boolean, p_sub_amounts jsonb, p_each_shares jsonb,
  p_is_active boolean default true
) returns json language plpgsql security definer set search_path = public as $$
declare v_expense expenses; v_item jsonb; v_person_id uuid;
begin
  if auth.uid() is null or auth.uid() <> p_user_id or not is_group_member(p_group_id, p_user_id) then
    raise exception 'Not authorized to create expenses in this group' using errcode = '42501';
  end if;
  if p_paid_by is null then
    raise exception 'paid_by is required' using errcode = '23502';
  end if;
  if not exists (select 1 from persons where id = p_paid_by and group_id = p_group_id) then
    raise exception 'Invalid paid_by person for this group' using errcode = '42501';
  end if;
  if p_category_id is null or not exists (select 1 from categories where id = p_category_id and group_id = p_group_id) then
    raise exception 'Invalid category for this group' using errcode = '42501';
  end if;
  if jsonb_typeof(p_each_shares) is distinct from 'array' or jsonb_array_length(p_each_shares) = 0
    or exists (select 1 from jsonb_array_elements(case when jsonb_typeof(p_each_shares) = 'array' then p_each_shares else '[]'::jsonb end) i where nullif(btrim(i->>'person_id'), '') is null or nullif(btrim(i->>'amount'), '') is null) then
    raise exception 'At least one each_share is required' using errcode = '23502';
  end if;
  insert into expenses (user_id, group_id, date, amount, reason, note, category_id, currency, paid_by, excluded, is_active)
  values (p_user_id, p_group_id, p_date, p_amount, p_reason, p_note, p_category_id, p_currency, p_paid_by, p_excluded, coalesce(p_is_active, true))
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

create function public.update_expense_with_sub_amounts(
  p_user_id uuid, p_group_id uuid, p_expense_id uuid, p_date timestamptz, p_amount text,
  p_reason text, p_note text, p_category_id uuid, p_currency text,
  p_paid_by uuid, p_excluded boolean, p_sub_amounts jsonb, p_each_shares jsonb,
  p_is_active boolean default true
) returns json language plpgsql security definer set search_path = public as $$
declare v_expense expenses;
begin
  if auth.uid() is null or auth.uid() <> p_user_id or not is_group_member(p_group_id, p_user_id) then
    raise exception 'Not authorized to update expenses in this group' using errcode = '42501';
  end if;
  if p_paid_by is null then
    raise exception 'paid_by is required' using errcode = '23502';
  end if;
  if not exists (select 1 from persons where id = p_paid_by and group_id = p_group_id) then
    raise exception 'Invalid paid_by person for this group' using errcode = '42501';
  end if;
  if p_category_id is null or not exists (select 1 from categories where id = p_category_id and group_id = p_group_id) then
    raise exception 'Invalid category for this group' using errcode = '42501';
  end if;
  if jsonb_typeof(p_each_shares) is distinct from 'array' or jsonb_array_length(p_each_shares) = 0
    or exists (select 1 from jsonb_array_elements(case when jsonb_typeof(p_each_shares) = 'array' then p_each_shares else '[]'::jsonb end) i where nullif(btrim(i->>'person_id'), '') is null or nullif(btrim(i->>'amount'), '') is null) then
    raise exception 'At least one each_share is required' using errcode = '23502';
  end if;
  if exists (select 1 from jsonb_array_elements(p_each_shares) i where not exists (select 1 from persons p where p.id = (i->>'person_id')::uuid and p.group_id = p_group_id)) then
    raise exception 'Invalid each_share person for this group' using errcode = '42501';
  end if;
  update expenses set date = p_date, amount = p_amount, reason = p_reason, note = p_note, category_id = p_category_id, currency = p_currency, paid_by = p_paid_by, excluded = p_excluded, is_active = coalesce(p_is_active, true)
  where id = p_expense_id and group_id = p_group_id;
  if not found then raise exception 'Expense not found' using errcode = 'P0002'; end if;
  delete from sub_amounts where expense_id = p_expense_id;
  delete from each_shares where expense_id = p_expense_id;
  insert into sub_amounts (expense_id, amount, reason)
    select p_expense_id, item->>'amount', nullif(item->>'reason', '') from jsonb_array_elements(coalesce(p_sub_amounts, '[]'::jsonb)) item;
  insert into each_shares (expense_id, person_id, amount)
    select p_expense_id, (item->>'person_id')::uuid, item->>'amount' from jsonb_array_elements(p_each_shares) item;
  select * into v_expense from expenses where id = p_expense_id;
  return (select row_to_json(t) from (select v_expense.*, coalesce((select json_agg(s) from sub_amounts s where s.expense_id = v_expense.id), '[]'::json) sub_amounts, coalesce((select json_agg(s) from each_shares s where s.expense_id = v_expense.id), '[]'::json) each_shares) t);
end; $$;

-- Function execution grants --------------------------------------------------

revoke all on function public.prevent_group_scope_change() from public, anon, authenticated;
revoke all on function public.prevent_expense_ownership_change() from public, anon, authenticated;
revoke all on function public.enforce_each_share_same_group() from public, anon, authenticated;
revoke all on function public.is_group_member(uuid, uuid) from public, anon, authenticated;
revoke all on function public.handle_new_profile() from public, anon, authenticated;
revoke all on function public.create_personal_group() from public, anon, authenticated;
revoke all on function public.create_owner_membership() from public, anon, authenticated;
revoke all on function public.prevent_owner_membership_change() from public, anon, authenticated;
revoke all on function public.prevent_last_group_deletion() from public, anon, authenticated;
revoke all on function public.get_group_by_invitation_token(uuid) from public, anon, authenticated;
revoke all on function public.get_or_create_group_invitation_token(uuid) from public, anon, authenticated;
revoke all on function public.join_group_by_invitation_token(uuid) from public, anon, authenticated;
revoke all on function public.delete_group(uuid) from public, anon, authenticated;
revoke all on function public.create_person_with_expense_shares(uuid, text) from public, anon, authenticated;
revoke all on function public.create_expense_with_sub_amounts(uuid, uuid, timestamptz, text, text, text, uuid, text, uuid, boolean, jsonb, jsonb, boolean) from public, anon, authenticated;
revoke all on function public.update_expense_with_sub_amounts(uuid, uuid, uuid, timestamptz, text, text, text, uuid, text, uuid, boolean, jsonb, jsonb, boolean) from public, anon, authenticated;

grant execute on function public.is_group_member(uuid, uuid) to authenticated;
grant execute on function public.get_group_by_invitation_token(uuid) to authenticated;
grant execute on function public.get_or_create_group_invitation_token(uuid) to authenticated;
grant execute on function public.join_group_by_invitation_token(uuid) to authenticated;
grant execute on function public.delete_group(uuid) to authenticated;
grant execute on function public.create_person_with_expense_shares(uuid, text) to authenticated;
grant execute on function public.create_expense_with_sub_amounts(uuid, uuid, timestamptz, text, text, text, uuid, text, uuid, boolean, jsonb, jsonb, boolean) to authenticated;
grant execute on function public.update_expense_with_sub_amounts(uuid, uuid, uuid, timestamptz, text, text, text, uuid, text, uuid, boolean, jsonb, jsonb, boolean) to authenticated;

alter default privileges for role postgres in schema public
  revoke execute on functions from public;

-- Row level security ---------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.persons enable row level security;
alter table public.categories enable row level security;
alter table public.expenses enable row level security;
alter table public.sub_amounts enable row level security;
alter table public.each_shares enable row level security;

create policy profiles_authenticated_read on public.profiles
  for select to authenticated using (true);

create policy groups_member_read on public.groups
  for select to authenticated using (public.is_group_member(id));
create policy groups_owner_insert on public.groups
  for insert to authenticated with check (owner_id = (select auth.uid()));
create policy groups_owner_update on public.groups
  for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));
create policy groups_owner_delete on public.groups
  for delete to authenticated using (
    owner_id = (select auth.uid())
    and (select count(*) from public.group_members where user_id = (select auth.uid())) > 1
  );

create policy group_members_read on public.group_members
  for select to authenticated using (public.is_group_member(group_id));
create policy group_members_owner_insert on public.group_members
  for insert to authenticated with check (exists (
    select 1 from public.groups
    where groups.id = group_members.group_id and groups.owner_id = (select auth.uid())
  ));
create policy group_members_owner_delete on public.group_members
  for delete to authenticated using (exists (
    select 1 from public.groups
    where groups.id = group_members.group_id
      and groups.owner_id = (select auth.uid())
      and groups.owner_id <> group_members.user_id
  ));

create policy persons_member_read on public.persons
  for select to authenticated using (public.is_group_member(group_id));
create policy persons_member_insert on public.persons
  for insert to authenticated with check (public.is_group_member(group_id));
create policy persons_member_update on public.persons
  for update to authenticated
  using (public.is_group_member(group_id))
  with check (public.is_group_member(group_id));
create policy persons_member_delete on public.persons
  for delete to authenticated using (public.is_group_member(group_id));

create policy categories_member_read on public.categories
  for select to authenticated using (public.is_group_member(group_id));
create policy categories_member_insert on public.categories
  for insert to authenticated with check (public.is_group_member(group_id));
create policy categories_member_update on public.categories
  for update to authenticated
  using (public.is_group_member(group_id))
  with check (public.is_group_member(group_id));
create policy categories_member_delete on public.categories
  for delete to authenticated using (public.is_group_member(group_id));

create policy expenses_member_read on public.expenses
  for select to authenticated using (public.is_group_member(group_id));
create policy expenses_member_insert on public.expenses
  for insert to authenticated
  with check (user_id = (select auth.uid()) and public.is_group_member(group_id));
create policy expenses_member_update on public.expenses
  for update to authenticated
  using (public.is_group_member(group_id))
  with check (public.is_group_member(group_id));
create policy expenses_member_delete on public.expenses
  for delete to authenticated using (public.is_group_member(group_id));

create policy sub_amounts_group_members on public.sub_amounts
  for all to authenticated
  using (exists (
    select 1 from public.expenses e
    where e.id = sub_amounts.expense_id and public.is_group_member(e.group_id)
  ))
  with check (exists (
    select 1 from public.expenses e
    where e.id = sub_amounts.expense_id and public.is_group_member(e.group_id)
  ));

create policy each_shares_group_members on public.each_shares
  for all to authenticated
  using (exists (
    select 1 from public.expenses e
    where e.id = each_shares.expense_id and public.is_group_member(e.group_id)
  ))
  with check (exists (
    select 1 from public.expenses e
    join public.persons p on p.id = each_shares.person_id and p.group_id = e.group_id
    where e.id = each_shares.expense_id and public.is_group_member(e.group_id)
  ));

-- Data API grants (tables are no longer exposed automatically) ---------------

grant select, insert, update, delete on all tables in schema public to authenticated, service_role;

alter default privileges for role postgres in schema public
  grant select, insert, update, delete on tables to authenticated, service_role;
alter default privileges for role postgres in schema public
  grant usage, select on sequences to authenticated, service_role;

