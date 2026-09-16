import { ErrorType } from "@/models/enums/errorType";
import { Group } from "@/models/group";

import { toGroup } from "@/utils/groupUtils";
import { profileService } from "./profileService";
import { supabase, supabaseAuthService } from "./supabaseAuthService";

export const groupService = {
  async create(name: string): Promise<void> {
    const ownerId = await supabaseAuthService.getCurrentUserId();
    const trimmedName = name.trim();

    const { error } = await supabase
      .from("groups")
      .insert({ owner_id: ownerId, name: trimmedName });

    if (error) {
      const customError = new Error("Failed to create expense group", {
        cause: error,
      });
      customError.name = ErrorType.FAILED_TO_CREATE_EXPENSE_GROUP;
      throw customError;
    }
  },

  async getAll(): Promise<Group[]> {
    const { data: groupRows, error } = await supabase
      .from("groups")
      .select("*, group_members(*)")
      .order("created_at", { ascending: true });

    if (error) {
      const customError = new Error("Failed to fetch groups", {
        cause: error,
      });
      customError.name = ErrorType.FAILED_TO_FETCH_EXPENSE_GROUPS;
      throw customError;
    }

    if (groupRows.length === 0) return [];

    const allMemberIds = groupRows.flatMap((g) =>
      g.group_members.map((m) => m.user_id),
    );
    const profiles = await profileService.getByUserIds(allMemberIds);

    return groupRows.map((group) =>
      toGroup(group, group.group_members, profiles),
    );
  },

  async getById(id: string): Promise<Group> {
    const { data: group, error } = await supabase
      .from("groups")
      .select("*, group_members(*)")
      .eq("id", id)
      .single();

    if (error || !group) {
      const customError = new Error("Failed to fetch expense group", {
        cause: error,
      });
      customError.name = ErrorType.FAILED_TO_FETCH_EXPENSE_GROUPS;
      throw customError;
    }

    const memberIds = [
      group.owner_id,
      ...group.group_members.map((member) => member.user_id),
    ];
    const profiles = await profileService.getByUserIds(memberIds);
    return toGroup(group, group.group_members, profiles);
  },

  async update(id: string, name: string): Promise<void> {
    const trimmedName = name.trim();
    if (!trimmedName) {
      const groupError = new Error("Expense group name is required");
      groupError.name = ErrorType.FAILED_TO_UPDATE_EXPENSE_GROUP;
      throw groupError;
    }

    const { data: group, error } = await supabase
      .from("groups")
      .update({ name: trimmedName })
      .eq("id", id)
      .select("*")
      .single();

    if (error || !group) {
      const customError = new Error("Failed to update expense group", {
        cause: error,
      });
      customError.name = ErrorType.FAILED_TO_UPDATE_EXPENSE_GROUP;
      throw customError;
    }
  },

  async joinByInvitationToken(token: string): Promise<Group> {
    const { data, error } = await supabase
      .rpc("join_group_by_invitation_token", { p_token: token })
      .single();

    if (error || !data) {
      const customError = new Error("Failed to join expense group", {
        cause: error,
      });
      customError.name = ErrorType.FAILED_TO_JOIN_EXPENSE_GROUP;
      throw customError;
    }

    return groupService.getById(data.id);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.rpc("delete_group", {
      p_group_id: id,
    });

    if (error?.code === "P0001") {
      const lastGroupError = new Error("Cannot delete your last expense group");
      lastGroupError.name = ErrorType.CANNOT_DELETE_LAST_EXPENSE_GROUP;
      throw lastGroupError;
    }

    if (error) {
      const customError = new Error("Failed to delete expense group", {
        cause: error,
      });
      customError.name = ErrorType.FAILED_TO_DELETE_EXPENSE_GROUP;
      throw customError;
    }
  },

  async removeMember(groupId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("group_members")
      .delete()
      .eq("group_id", groupId)
      .eq("user_id", userId);

    if (error) {
      const customError = new Error("Failed to remove expense group member", {
        cause: error,
      });
      customError.name = ErrorType.FAILED_TO_MANAGE_EXPENSE_GROUP_MEMBERS;
      throw customError;
    }
  },
};
