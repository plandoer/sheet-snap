drop function if exists create_expense_with_sub_amounts(
  uuid, timestamptz, text, text, text, text, text, uuid, boolean, boolean, jsonb
);
drop function if exists create_expense_with_sub_amounts(
  uuid, timestamptz, text, text, text, text, text, uuid, boolean, boolean, jsonb, jsonb
);

create function create_expense_with_sub_amounts(
  p_user_id       uuid,
  p_date          timestamptz,
  p_amount        text,
  p_reason        text,
  p_note          text,
  p_category      text,
  p_currency      text,
  p_paid_by       uuid,
  p_split_in_half boolean,
  p_excluded      boolean,
  p_sub_amounts   jsonb,
  p_each_shares   jsonb
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_expense     expenses;
  v_sub_item    jsonb;
  v_share_item  jsonb;
  v_person_id   uuid;
begin
  if auth.uid() is null or auth.uid() <> p_user_id then
    raise exception 'Not authorized to create expenses for this user' using errcode = '42501';
  end if;

  if p_paid_by is not null and not exists (
    select 1
    from persons
    where id = p_paid_by
      and user_id = p_user_id
  ) then
    raise exception 'Invalid paid_by person for this user' using errcode = '42501';
  end if;

  insert into expenses (user_id, date, amount, reason, note, category,
                        currency, paid_by, split_in_half, excluded)
  values (p_user_id, p_date, p_amount, p_reason, p_note, p_category,
          p_currency, p_paid_by, p_split_in_half, p_excluded)
  returning * into v_expense;

  for v_sub_item in select * from jsonb_array_elements(p_sub_amounts) loop
    insert into sub_amounts (expense_id, amount, reason)
    values (
      v_expense.id,
      v_sub_item->>'amount',
      nullif(v_sub_item->>'reason', '')
    );
  end loop;

  for v_share_item in select * from jsonb_array_elements(coalesce(p_each_shares, '[]'::jsonb)) loop
    v_person_id := nullif(v_share_item->>'person_id', '')::uuid;

    if v_person_id is null or not exists (
      select 1
      from persons
      where id = v_person_id
        and user_id = p_user_id
    ) then
      raise exception 'Invalid each_share person for this user' using errcode = '42501';
    end if;

    insert into each_shares (expense_id, person_id, amount)
    values (
      v_expense.id,
      v_person_id,
      v_share_item->>'amount'
    );
  end loop;

  return (
    select row_to_json(t) from (
      select
        v_expense.id,
        v_expense.user_id,
        v_expense.date,
        v_expense.amount,
        v_expense.reason,
        v_expense.note,
        v_expense.category,
        v_expense.currency,
        v_expense.paid_by,
        v_expense.split_in_half,
        v_expense.excluded,
        v_expense.created_at,
        coalesce(
          (select json_agg(s) from sub_amounts s where s.expense_id = v_expense.id),
          '[]'::json
        ) as sub_amounts,
        coalesce(
          (select json_agg(es) from each_shares es where es.expense_id = v_expense.id),
          '[]'::json
        ) as each_shares
    ) t
  );
end;
$$;

drop function if exists update_expense_with_sub_amounts(
  uuid, uuid, timestamptz, text, text, text, text, text, uuid, boolean, boolean, jsonb
);
drop function if exists update_expense_with_sub_amounts(
  uuid, uuid, timestamptz, text, text, text, text, text, uuid, boolean, boolean, jsonb, jsonb
);

create function update_expense_with_sub_amounts(
  p_user_id       uuid,
  p_expense_id    uuid,
  p_date          timestamptz,
  p_amount        text,
  p_reason        text,
  p_note          text,
  p_category      text,
  p_currency      text,
  p_paid_by       uuid,
  p_split_in_half boolean,
  p_excluded      boolean,
  p_sub_amounts   jsonb,
  p_each_shares   jsonb
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_expense     expenses;
  v_sub_item    jsonb;
  v_share_item  jsonb;
  v_person_id   uuid;
begin
  if auth.uid() is null or auth.uid() <> p_user_id then
    raise exception 'Not authorized to update expenses for this user' using errcode = '42501';
  end if;

  if p_paid_by is not null and not exists (
    select 1
    from persons
    where id = p_paid_by
      and user_id = p_user_id
  ) then
    raise exception 'Invalid paid_by person for this user' using errcode = '42501';
  end if;

  update expenses
  set date = p_date,
      amount = p_amount,
      reason = p_reason,
      note = p_note,
      category = p_category,
      currency = p_currency,
      paid_by = p_paid_by,
      split_in_half = p_split_in_half,
      excluded = p_excluded
  where id = p_expense_id
    and user_id = p_user_id
  returning * into v_expense;

  if not found then
    raise exception 'Expense not found' using errcode = 'P0002';
  end if;

  delete from sub_amounts where expense_id = v_expense.id;
  delete from each_shares where expense_id = v_expense.id;

  for v_sub_item in select * from jsonb_array_elements(p_sub_amounts) loop
    insert into sub_amounts (expense_id, amount, reason)
    values (
      v_expense.id,
      v_sub_item->>'amount',
      nullif(v_sub_item->>'reason', '')
    );
  end loop;

  for v_share_item in select * from jsonb_array_elements(coalesce(p_each_shares, '[]'::jsonb)) loop
    v_person_id := nullif(v_share_item->>'person_id', '')::uuid;

    if v_person_id is null or not exists (
      select 1
      from persons
      where id = v_person_id
        and user_id = p_user_id
    ) then
      raise exception 'Invalid each_share person for this user' using errcode = '42501';
    end if;

    insert into each_shares (expense_id, person_id, amount)
    values (
      v_expense.id,
      v_person_id,
      v_share_item->>'amount'
    );
  end loop;

  return (
    select row_to_json(t) from (
      select
        v_expense.id,
        v_expense.user_id,
        v_expense.date,
        v_expense.amount,
        v_expense.reason,
        v_expense.note,
        v_expense.category,
        v_expense.currency,
        v_expense.paid_by,
        v_expense.split_in_half,
        v_expense.excluded,
        v_expense.created_at,
        coalesce(
          (select json_agg(s) from sub_amounts s where s.expense_id = v_expense.id),
          '[]'::json
        ) as sub_amounts,
        coalesce(
          (select json_agg(es) from each_shares es where es.expense_id = v_expense.id),
          '[]'::json
        ) as each_shares
    ) t
  );
end;
$$;
