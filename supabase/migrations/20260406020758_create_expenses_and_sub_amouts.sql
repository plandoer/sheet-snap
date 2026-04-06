-- expenses
create table if not exists expenses (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  date          timestamptz not null,
  amount        text not null,
  reason        text,
  note          text,
  category      text,
  currency      text not null default '',
  paid_by       text,
  split_in_half boolean not null default false,
  excluded      boolean not null default false,
  created_at    timestamptz not null default now()
);

-- sub_amounts (one row per line item, FK to expenses)
create table if not exists sub_amounts (
  id         uuid primary key default gen_random_uuid(),
  expense_id uuid not null references expenses(id) on delete cascade,
  amount     text not null,
  reason     text
);

-- RLS
alter table expenses enable row level security;
alter table sub_amounts enable row level security;

-- expenses: owner full access
create policy "owner_all" on expenses for all
  using  ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- sub_amounts: accessible if user owns the parent expense
create policy "sub_amounts_owner" on sub_amounts for all
  using (
    exists (
      select 1 from expenses
      where expenses.id = sub_amounts.expense_id
        and expenses.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from expenses
      where expenses.id = sub_amounts.expense_id
        and expenses.user_id = (select auth.uid())
    )
  );