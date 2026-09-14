alter table public.expense_groups rename to groups;

alter table public.groups
	rename constraint expense_groups_pkey to groups_pkey;

alter table public.groups
	rename constraint expense_groups_owner_id_fkey to groups_owner_id_fkey;

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

create or replace function public.create_owner_membership()
returns trigger language plpgsql security definer set search_path = public as $$
begin
	insert into public.group_members (group_id, user_id)
	values (new.id, new.owner_id);
	return new;
end;
$$;

create or replace function public.create_personal_group()
returns trigger language plpgsql security definer set search_path = public as $$
begin
	insert into public.groups (owner_id, name)
	values (new.id, 'Personal');
	return new;
end;
$$;

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

create or replace function public.get_group_by_invitation_token(p_token uuid)
returns table (id uuid, name text)
language sql stable security definer set search_path = public as $$
	select g.id, g.name
	from groups g
	where g.invitation_token = p_token;
$$;

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
