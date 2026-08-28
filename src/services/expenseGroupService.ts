import { ErrorType } from "@/models/enums/errorType";
import { ExpenseGroup } from "@/models/expenseGroup";

import { toExpenseGroup } from "@/utils/expenseGroupUtils";
import { profileService } from "./profileService";
import { supabase, supabaseAuthService } from "./supabaseAuthService";

export const expenseGroupService = {
  async create(name: string): Promise<void> {
    const ownerId = await supabaseAuthService.getCurrentUserId();
    const trimmedName = name.trim();

    const { error } = await supabase
      .from("expense_groups")
      .insert({ owner_id: ownerId, name: trimmedName });

    if (error) {
      const customError = new Error("Failed to create expense group", {
        cause: error,
      });
      customError.name = ErrorType.FAILED_TO_CREATE_EXPENSE_GROUP;
      throw customError;
    }
  },

  async getAll(): Promise<ExpenseGroup[]> {
    const { data: groupRows, error } = await supabase
      .from("expense_groups")
      .select("*, group_members(*)")
      .order("created_at", { ascending: true });

    if (error) {
      const customError = new Error("Failed to fetch expense groups", {
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
      toExpenseGroup(group, group.group_members, profiles),
    );
  },

  async update(id: string, name: string): Promise<void> {
    const trimmedName = name.trim();
    if (!trimmedName) {
      const groupError = new Error("Expense group name is required");
      groupError.name = ErrorType.FAILED_TO_UPDATE_EXPENSE_GROUP;
      throw groupError;
    }

    const { data: group, error } = await supabase
      .from("expense_groups")
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

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("expense_groups")
      .delete()
      .eq("id", id);

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
