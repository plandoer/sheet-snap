-- Associate persons with a group instead of a user, so each group maintains
-- its own set of persons that cannot be shared across other groups.

alter table public.persons
  add column group_id uuid references public.groups(id) on delete cascade;

-- Backfill: assign each existing person to the group they created the
-- person as owner of (falling back to any group they belong to).
update public.persons p
set group_id = (
  select g.id
  from public.groups g
  where g.owner_id = p.user_id
  order by g.created_at asc
  limit 1
)
where group_id is null;

update public.persons p
set group_id = (
  select gm.group_id
  from public.group_members gm
  where gm.user_id = p.user_id
  order by gm.joined_at asc
  limit 1
)
where group_id is null;

alter table public.persons
  alter column group_id set not null;

alter table public.persons
  drop constraint if exists persons_user_id_name_key;

alter table public.persons
  add constraint persons_group_id_name_key unique (group_id, name);

drop index if exists idx_persons_user_id;
create index if not exists idx_persons_group_id on public.persons using btree (group_id);

drop policy if exists "persons_owner_all" on public.persons;
create policy "persons_group_members_all" on public.persons for all
  to authenticated using (is_group_member(group_id))
  with check (is_group_member(group_id));

alter table public.persons
  drop column user_id;

-- Validate paid_by/each_shares persons via group membership instead of
-- direct ownership, since persons now belong to a group rather than a user.
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
