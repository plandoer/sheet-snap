-- Index to speed up expense delete cascade and lookups by expense_id
create index if not exists idx_sub_amounts_expense_id on sub_amounts(expense_id);
