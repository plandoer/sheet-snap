-- Creates a person and adds it to every active expense in the group, atomically.
-- Shares are re-split equally; the rounding remainder goes to the payer's share.
create or replace function public.create_person_with_expense_shares(p_group_id uuid, p_name text)
returns public.persons
language plpgsql
set search_path = public
as $$
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

	for v_expense in
		select e.id, e.amount, e.paid_by
		from expenses e
		where e.group_id = p_group_id
			and e.is_active
			and e.amount ~ '^\s*\d+(\.\d+)?\s*$'
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

grant execute on function public.create_person_with_expense_shares(uuid, text) to authenticated;
