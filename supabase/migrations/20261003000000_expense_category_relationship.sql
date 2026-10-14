alter table public.expenses drop column category;

alter table public.expenses
	add column category_id uuid not null references public.categories(id) on delete restrict;

create index if not exists idx_expenses_category_id
	on public.expenses using btree (category_id);

drop function if exists public.create_expense_with_sub_amounts(
	uuid, uuid, timestamptz, text, text, text, text, text, uuid, boolean, boolean, jsonb, jsonb, boolean
);

create or replace function public.create_expense_with_sub_amounts(
	p_user_id uuid, p_group_id uuid, p_date timestamptz, p_amount text,
	p_reason text, p_note text, p_category_id uuid, p_currency text, p_paid_by uuid,
	p_split_in_half boolean, p_excluded boolean, p_sub_amounts jsonb, p_each_shares jsonb,
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
	insert into expenses (user_id, group_id, date, amount, reason, note, category_id, currency, paid_by, split_in_half, excluded, is_active)
	values (p_user_id, p_group_id, p_date, p_amount, p_reason, p_note, p_category_id, p_currency, p_paid_by, p_split_in_half, p_excluded, coalesce(p_is_active, true))
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

drop function if exists public.update_expense_with_sub_amounts(
	uuid, uuid, uuid, timestamptz, text, text, text, text, text, uuid, boolean, boolean, jsonb, jsonb, boolean
);

create or replace function public.update_expense_with_sub_amounts(
	p_user_id uuid, p_group_id uuid, p_expense_id uuid, p_date timestamptz, p_amount text,
	p_reason text, p_note text, p_category_id uuid, p_currency text, p_paid_by uuid,
	p_split_in_half boolean, p_excluded boolean, p_sub_amounts jsonb, p_each_shares jsonb,
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
	update expenses set date = p_date, amount = p_amount, reason = p_reason, note = p_note, category_id = p_category_id, currency = p_currency, paid_by = p_paid_by, split_in_half = p_split_in_half, excluded = p_excluded, is_active = coalesce(p_is_active, true)
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
