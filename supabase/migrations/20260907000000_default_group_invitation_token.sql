-- Generate the invitation token at insert time instead of lazily via RPC.
alter table expense_groups alter column invitation_token set default gen_random_uuid();

update expense_groups set invitation_token = gen_random_uuid() where invitation_token is null;

drop function if exists public.get_or_create_group_invitation_token(uuid);
