alter table expense_groups add column if not exists invitation_token uuid unique;

-- Returns the group's existing invitation token, generating one on first use.
-- Only the group owner may call this.
create or replace function public.get_or_create_group_invitation_token(p_group_id uuid)
returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_token uuid;
begin
  if not exists (
    select 1 from expense_groups where id = p_group_id and owner_id = auth.uid()
  ) then
    raise exception 'Only the group owner can generate an invitation link' using errcode = '42501';
  end if;

  select invitation_token into v_token from expense_groups where id = p_group_id;

  if v_token is null then
    v_token := gen_random_uuid();
    update expense_groups set invitation_token = v_token where id = p_group_id;
  end if;

  return v_token;
end;
$$;

grant execute on function public.get_or_create_group_invitation_token(uuid) to authenticated;

-- Lets any authenticated user preview the target group before joining, since
-- the normal "groups_member_read" policy would otherwise hide it from non-members.
create or replace function public.get_group_by_invitation_token(p_token uuid)
returns table (id uuid, name text)
language sql stable security definer set search_path = public as $$
  select eg.id, eg.name
  from expense_groups eg
  where eg.invitation_token = p_token;
$$;

grant execute on function public.get_group_by_invitation_token(uuid) to authenticated;

-- Adds the current authenticated user as a member of the group identified by the token.
create or replace function public.join_group_by_invitation_token(p_token uuid)
returns table (id uuid, name text)
language plpgsql security definer set search_path = public as $$
declare
  v_group_id uuid;
  v_group_name text;
begin
  select eg.id, eg.name into v_group_id, v_group_name
  from expense_groups eg
  where eg.invitation_token = p_token;

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
