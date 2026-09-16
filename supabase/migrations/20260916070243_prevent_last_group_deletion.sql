create or replace function public.prevent_last_group_deletion()
returns trigger
language plpgsql
set search_path = public
as $$
declare
	v_group_count integer;
begin
	if auth.uid() is null or auth.uid() <> old.owner_id then
		return old;
	end if;

	perform pg_advisory_xact_lock(hashtextextended(old.owner_id::text, 0));

	select count(*)
	into v_group_count
	from public.group_members
	where user_id = old.owner_id;

	if v_group_count <= 1 then
		raise exception 'Cannot delete your last expense group' using errcode = 'P0001';
	end if;

	return old;
end;
$$;

drop trigger if exists prevent_last_group_deletion_on_group on public.groups;
create trigger prevent_last_group_deletion_on_group
before delete on public.groups
for each row execute function public.prevent_last_group_deletion();
