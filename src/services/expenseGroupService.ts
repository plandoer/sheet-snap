import { ErrorType } from "@/models/enums/errorType";
import { ExpenseGroup } from "@/models/expenseGroup";
import { Tables } from "@/models/supabase/database.types";
import { User } from "@/models/user";
import { getCurrentSupabaseUserId, supabase } from "./supabaseAuthService";

type Profile = Tables<"profiles">;
type GroupMember = Tables<"group_members">;

export async function createExpenseGroup(name: string): Promise<void> {
  const ownerId = await getCurrentSupabaseUserId();
  const trimmedName = name.trim();

  const { error } = await supabase
    .from("expense_groups")
    .insert({ owner_id: ownerId, name: trimmedName });

  if (error) {
    throw groupError(
      "Failed to create expense group",
      error,
      ErrorType.FAILED_TO_CREATE_EXPENSE_GROUP,
    );
  }
}

export async function getExpenseGroups(): Promise<ExpenseGroup[]> {
  const { data: groupRows, error } = await supabase
    .from("expense_groups")
    .select("*, group_members(*)")
    .order("created_at", { ascending: true });

  if (error) {
    throw groupError(
      "Failed to fetch expense groups",
      error,
      ErrorType.FAILED_TO_FETCH_EXPENSE_GROUPS,
    );
  }

  if (groupRows.length === 0) return [];

  const allMemberIds = groupRows.flatMap((g) =>
    g.group_members.map((m) => m.user_id),
  );
  const profiles = await getProfiles(allMemberIds);

  return groupRows.map((group) =>
    toExpenseGroup(group, group.group_members, profiles),
  );
}

export async function updateExpenseGroup(
  id: string,
  name: string,
): Promise<void> {
  const trimmedName = name.trim();
  if (!trimmedName) {
    throw groupError(
      "Expense group name is required",
      null,
      ErrorType.FAILED_TO_UPDATE_EXPENSE_GROUP,
    );
  }

  const { data: group, error } = await supabase
    .from("expense_groups")
    .update({ name: trimmedName })
    .eq("id", id)
    .select("*")
    .single();

  if (error || !group) {
    throw groupError(
      "Failed to update expense group",
      error,
      ErrorType.FAILED_TO_UPDATE_EXPENSE_GROUP,
    );
  }
}

export async function deleteExpenseGroup(id: string): Promise<void> {
  const { error } = await supabase.from("expense_groups").delete().eq("id", id);
  if (error) {
    throw groupError(
      "Failed to delete expense group",
      error,
      ErrorType.FAILED_TO_DELETE_EXPENSE_GROUP,
    );
  }
}

export async function addMemberToExpenseGroup(
  groupId: string,
  email: string,
): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", normalizedEmail)
    .single();
  if (profileError || !profile) {
    throw groupError(
      "No user found with that email",
      profileError,
      ErrorType.FAILED_TO_MANAGE_EXPENSE_GROUP_MEMBERS,
    );
  }

  const { error } = await supabase.from("group_members").insert({
    group_id: groupId,
    user_id: profile.id,
  });

  if (error) {
    throw groupError(
      "Failed to add expense group member",
      error,
      ErrorType.FAILED_TO_MANAGE_EXPENSE_GROUP_MEMBERS,
    );
  }
}

export async function removeMemberFromExpenseGroup(
  groupId: string,
  userId: string,
): Promise<void> {
  const { error } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", userId);

  if (error) {
    throw groupError(
      "Failed to remove expense group member",
      error,
      ErrorType.FAILED_TO_MANAGE_EXPENSE_GROUP_MEMBERS,
    );
  }
}

async function getProfiles(userIds: string[]): Promise<Map<string, Profile>> {
  const uniqueIds = Array.from(new Set(userIds));

  if (uniqueIds.length === 0) return new Map();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .in("id", uniqueIds);

  if (error) {
    throw groupError(
      "Failed to fetch expense group profiles",
      error,
      ErrorType.FAILED_TO_FETCH_EXPENSE_GROUPS,
    );
  }

  return new Map(data.map((profile) => [profile.id, profile]));
}

function toExpenseGroup(
  row: Tables<"expense_groups">,
  memberRows: GroupMember[],
  profiles: Map<string, Profile>,
): ExpenseGroup {
  const group = new ExpenseGroup();
  group.id = row.id;
  group.name = row.name;
  group.createdAt = row.created_at;
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

function groupError(message: string, cause: unknown, name: ErrorType): Error {
  const error = new Error(message, { cause });
  error.name = name;
  return error;
}
