import { ExpenseGroup } from "@/models/expenseGroup";
import { Tables } from "@/models/supabase/database.types";
import { User } from "@/models/user";

type GroupMember = Tables<"group_members">;
type Profile = Tables<"profiles">;

const INVITATION_LINK_BASE_URL =
  process.env.EXPO_PUBLIC_INVITATION_LINK_BASE_URL!;

export function buildInvitationLink(token: string): string {
  return `${INVITATION_LINK_BASE_URL}?token=${encodeURIComponent(token)}`;
}

export function toExpenseGroup(
  row: Tables<"expense_groups">,
  memberRows: GroupMember[],
  profiles: Map<string, Profile>,
): ExpenseGroup {
  const group = new ExpenseGroup();
  group.id = row.id;
  group.name = row.name;
  group.createdAt = row.created_at;
  group.invitationToken = row.invitation_token;
  const members = memberRows.filter((member) => member.group_id === row.id);
  group.owner = toUser(profiles.get(row.owner_id), row.owner_id);
  group.members = members
    .filter((member) => member.user_id !== row.owner_id)
    .map((member) => toUser(profiles.get(member.user_id), member.user_id));
  return group;
}

function toUser(profile: Profile | undefined, id: string): User {
  const user = new User();
  user.id = id;
  user.name = profile?.name ?? null;
  user.email = profile?.email ?? null;
  user.photo = profile?.photo ?? null;
  return user;
}
