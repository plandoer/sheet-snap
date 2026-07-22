create table if not exists each_shares (
  id         uuid primary key default gen_random_uuid(),
  expense_id uuid not null references expenses(id) on delete cascade,
  person_id  uuid not null references persons(id) on delete cascade,
  amount     text not null,
  unique (expense_id, person_id)
);

alter table each_shares enable row level security;

create policy "each_shares_owner" on each_shares for all
  using (
    exists (
      select 1
      from expenses
      where expenses.id = each_shares.expense_id
        and expenses.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from expenses
      where expenses.id = each_shares.expense_id
        and expenses.user_id = auth.uid()
    )
  );

drop policy if exists "each_shares_shared" on each_shares;

do $$
begin
  if to_regclass('public.expense_shares') is not null then
    execute $policy$
      create policy "each_shares_shared" on each_shares for select
        using (
          exists (
            select 1
            from expense_shares
            where expense_shares.expense_id = each_shares.expense_id
              and expense_shares.shared_with = auth.uid()
          )
        )
    $policy$;
  end if;
end;
$$;

create index if not exists idx_each_shares_expense_id on each_shares(expense_id);
create index if not exists idx_each_shares_person_id on each_shares(person_id);
