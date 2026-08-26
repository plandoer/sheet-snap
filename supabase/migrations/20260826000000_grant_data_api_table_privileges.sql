-- Supabase's local dev stack no longer grants default table privileges to
-- anon/authenticated/service_role on new/existing public tables (see
-- https://supabase.com/changelog/45329). RLS policies alone are not enough;
-- PostgREST also requires an explicit GRANT before it can reach a table.
grant select, insert, update, delete on table
  public.profiles,
  public.expense_groups,
  public.group_members,
  public.expenses,
  public.sub_amounts,
  public.each_shares,
  public.persons
to authenticated, service_role;

-- Keep future tables in public reachable via the Data API without needing a
-- manual grant every time, matching the pre-breaking-change default.
alter default privileges for role postgres in schema public
  grant select, insert, update, delete on tables to authenticated, service_role;

alter default privileges for role postgres in schema public
  grant usage, select on sequences to authenticated, service_role;
