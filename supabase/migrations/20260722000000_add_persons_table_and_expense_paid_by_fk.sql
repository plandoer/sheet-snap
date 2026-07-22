create table if not exists persons (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  created_at timestamptz not null default now(),
  unique(user_id, name)
);

alter table persons enable row level security;

drop policy if exists "persons_owner_all" on persons;
create policy "persons_owner_all" on persons for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Existing environments may still have expenses.paid_by as text.
do $$
declare
  v_paid_by_type text;
begin
  select data_type
  into v_paid_by_type
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'expenses'
    and column_name = 'paid_by';

  if v_paid_by_type is null then
    alter table expenses add column paid_by uuid;
  elsif v_paid_by_type <> 'uuid' then
    alter table expenses drop column paid_by;
    alter table expenses add column paid_by uuid;
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'expenses_paid_by_fkey'
  ) then
    alter table expenses
      add constraint expenses_paid_by_fkey
      foreign key (paid_by)
      references persons(id)
      on delete set null;
  end if;
end;
$$;

create index if not exists idx_persons_user_id on persons(user_id);
create index if not exists idx_expenses_paid_by on expenses(paid_by);
