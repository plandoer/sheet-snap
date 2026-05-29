create or replace function create_expense_with_sub_amounts(
  p_user_id       uuid,
  p_date          timestamptz,
  p_amount        text,
  p_reason        text,
  p_note          text,
  p_category      text,
  p_currency      text,
  p_paid_by       text,
  p_split_in_half boolean,
  p_excluded      boolean,
  p_sub_amounts   jsonb
)
returns expenses
language plpgsql
security definer
set search_path = public
as $$
declare
  v_expense expenses;
  v_sub     jsonb;
begin
  insert into expenses (user_id, date, amount, reason, note, category,
                        currency, paid_by, split_in_half, excluded)
  values (p_user_id, p_date, p_amount, p_reason, p_note, p_category,
          p_currency, p_paid_by, p_split_in_half, p_excluded)
  returning * into v_expense;

  for v_sub in select * from jsonb_array_elements(p_sub_amounts) loop
    insert into sub_amounts (expense_id, amount, reason)
    values (
      v_expense.id,
      v_sub->>'amount',
      nullif(v_sub->>'reason', '')
    );
  end loop;

  return v_expense;
end;
$$;
