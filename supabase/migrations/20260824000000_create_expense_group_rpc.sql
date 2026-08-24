create or replace function public.create_expense_group(
  p_owner_id uuid,
  p_name text,
  p_member_ids uuid[] default '{}'::uuid[]
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_group_id uuid;
begin
  if auth.uid() is null or auth.uid() <> p_owner_id then
    raise exception 'Not authorized to create expense groups' using errcode = '42501';
  end if;

  if nullif(trim(p_name), '') is null then
    raise exception 'Expense group name is required' using errcode = '22023';
  end if;

  insert into expense_groups (owner_id, name)
  values (p_owner_id, trim(p_name))
  returning id into v_group_id;

  insert into group_members (group_id, user_id)
  select v_group_id, member_id
  from unnest(coalesce(p_member_ids, '{}'::uuid[])) as member_id
  where member_id <> p_owner_id
  on conflict (group_id, user_id) do nothing;

  return v_group_id;
end;
$$;

grant execute on function public.create_expense_group(uuid, text, uuid[]) to authenticated;