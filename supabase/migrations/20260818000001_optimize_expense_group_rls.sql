drop policy if exists "groups_owner_insert" on expense_groups;
create policy "groups_owner_insert" on expense_groups for insert
  to authenticated with check (owner_id = (select auth.uid()));

drop policy if exists "groups_owner_update" on expense_groups;
create policy "groups_owner_update" on expense_groups for update
  to authenticated using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

drop policy if exists "groups_owner_delete" on expense_groups;
create policy "groups_owner_delete" on expense_groups for delete
  to authenticated using (
    owner_id = (select auth.uid())
    and (select count(*) from group_members where user_id = (select auth.uid())) > 1
  );

drop policy if exists "group_members_owner_insert" on group_members;
create policy "group_members_owner_insert" on group_members for insert
  to authenticated with check (
    exists (
      select 1 from expense_groups
      where id = group_id and owner_id = (select auth.uid())
    )
  );

drop policy if exists "group_members_owner_delete" on group_members;
create policy "group_members_owner_delete" on group_members for delete
  to authenticated using (
    exists (
      select 1 from expense_groups
      where id = group_id
        and owner_id = (select auth.uid())
        and owner_id <> user_id
    )
  );