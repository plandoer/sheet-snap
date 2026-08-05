drop function if exists create_expense_with_sub_amounts(
  uuid, timestamptz, text, text, text, text, text, text, boolean, boolean, jsonb
);
drop function if exists create_expense_with_sub_amounts(
  uuid, timestamptz, text, text, text, text, text, uuid, boolean, boolean, jsonb
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
  p_sub_amounts   jsonb
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_expense  expenses;
  v_sub_item jsonb;
begin
  if (select auth.uid()) is null or (select auth.uid()) <> p_user_id then
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
        ) as sub_amounts
    ) t
  );
end;
$$;

drop function if exists update_expense_with_sub_amounts(
  uuid, uuid, timestamptz, text, text, text, text, text, text, boolean, boolean, jsonb
);
drop function if exists update_expense_with_sub_amounts(
  uuid, uuid, timestamptz, text, text, text, text, text, uuid, boolean, boolean, jsonb
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
  p_sub_amounts   jsonb
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_expense  expenses;
  v_sub_item jsonb;
begin
  if (select auth.uid()) is null or (select auth.uid()) <> p_user_id then
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

  for v_sub_item in select * from jsonb_array_elements(p_sub_amounts) loop
    insert into sub_amounts (expense_id, amount, reason)
    values (
      v_expense.id,
      v_sub_item->>'amount',
      nullif(v_sub_item->>'reason', '')
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
        ) as sub_amounts
    ) t
  );
end;
$$;
