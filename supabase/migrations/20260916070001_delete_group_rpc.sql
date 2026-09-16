create or replace function public.delete_group(p_group_id uuid)
returns void
language plpgsql
set search_path = public
as $$
declare
	v_owner_id uuid;
	v_group_count integer;
begin
	if auth.uid() is null then
		raise exception 'Not authorized to delete expense group' using errcode = '42501';
	end if;

	select owner_id
	into v_owner_id
	from public.groups
	where id = p_group_id
	for update;

	if v_owner_id is null or v_owner_id <> auth.uid() then
		raise exception 'Not authorized to delete expense group' using errcode = '42501';
	end if;

	perform pg_advisory_xact_lock(hashtextextended(v_owner_id::text, 0));

	select count(*)
	into v_group_count
	from public.group_members
	where user_id = v_owner_id;

	if v_group_count <= 1 then
		raise exception 'Cannot delete your last expense group' using errcode = 'P0001';
	end if;

	delete from public.groups
	where id = p_group_id;
end;
$$;

grant execute on function public.delete_group(uuid) to authenticated;
