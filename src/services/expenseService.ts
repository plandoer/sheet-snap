import { ErrorType } from "@/models/enums/errorType";
import { Expense } from "@/models/expense";
import { toExpense } from "@/utils/expenseUtils";
import { supabase, supabaseAuthService } from "./supabaseAuthService";

export const expenseService = {
  async create(expense: Expense, groupId: string): Promise<void> {
    const userId = await supabaseAuthService.getCurrentUserId();

    const { data: expenseRow, error } = await supabase
      .rpc("create_expense_with_sub_amounts", {
        p_user_id: userId,
        p_group_id: groupId,
        p_date: expense.date.toISOString(),
        p_amount: expense.amount,
        p_reason: expense.reason || null,
        p_note: expense.note || null,
        p_category: expense.category || null,
        p_currency: expense.currency,
        p_paid_by: expense.paidBy.id || null,
        p_split_in_half: expense.splitInHalf,
        p_excluded: expense.excluded,
        p_sub_amounts: expense.subAmounts.map((s) => ({
          amount: s.amount,
          reason: s.reason,
        })),
        p_each_shares: expense.eachShares.map((share) => ({
          person_id: share.person.id,
          amount: share.amount,
        })),
      })
      .single();

    if (error || !expenseRow) {
      const customError = new Error("Failed to create expense", {
        cause: error,
      });
      customError.name = ErrorType.FAILED_TO_CREATE_EXPENSE;
      throw customError;
    }
  },

  async getByGroupId(groupId: string): Promise<Expense[]> {
    const { data: expenseRows, error } = await supabase
      .from("expenses")
      .select(
        "*, paid_by_person:persons!expenses_paid_by_fkey(*), sub_amounts(*), each_shares(*, person:persons!each_shares_person_id_fkey(*))",
      )
      .eq("group_id", groupId)
      .order("date", { ascending: false });

    if (error) {
      const customError = new Error(
        `Failed to fetch expenses for group ${groupId}`,
        {
          cause: error,
        },
      );
      customError.name = ErrorType.FAILED_TO_FETCH_EXPENSES;
      throw customError;
    }

    return expenseRows.map(toExpense);
  },

  async getNotExcludedByGroupId(groupId: string): Promise<Expense[]> {
    const { data: expenseRows, error } = await supabase
      .from("expenses")
      .select(
        "*, paid_by_person:persons!expenses_paid_by_fkey(*), sub_amounts(*), each_shares(*, person:persons!each_shares_person_id_fkey(*))",
      )
      .eq("excluded", false)
      .eq("group_id", groupId)
      .order("date", { ascending: false });

    if (error) {
      const customError = new Error(
        `Failed to fetch non-excluded expenses for group ${groupId}`,
        {
          cause: error,
        },
      );
      customError.name = ErrorType.FAILED_TO_FETCH_EXPENSES;
      throw customError;
    }

    return expenseRows.map(toExpense);
  },

  async getById(id: string): Promise<Expense> {
    const { data: expenseRow, error } = await supabase
      .from("expenses")
      .select(
        "*, paid_by_person:persons!expenses_paid_by_fkey(*), sub_amounts(*), each_shares(*, person:persons!each_shares_person_id_fkey(*))",
      )
      .eq("id", id)
      .single();

    if (error || !expenseRow) {
      const customError = new Error("Failed to fetch expense by id", {
        cause: error,
      });
      customError.name = ErrorType.FAILED_TO_FETCH_EXPENSE_BY_ID;
      throw customError;
    }

    return toExpense(expenseRow);
  },

  async update(id: string, expense: Expense, groupId: string): Promise<void> {
    const userId = await supabaseAuthService.getCurrentUserId();

    const { data: expenseRow, error } = await supabase
      .rpc("update_expense_with_sub_amounts", {
        p_user_id: userId,
        p_group_id: groupId,
        p_expense_id: id,
        p_date: expense.date.toISOString(),
        p_amount: expense.amount,
        p_reason: expense.reason || null,
        p_note: expense.note || null,
        p_category: expense.category || null,
        p_currency: expense.currency,
        p_paid_by: expense.paidBy.id || null,
        p_split_in_half: expense.splitInHalf,
        p_excluded: expense.excluded,
        p_sub_amounts: expense.subAmounts.map((s) => ({
          amount: s.amount,
          reason: s.reason,
        })),
        p_each_shares: expense.eachShares.map((share) => ({
          person_id: share.person.id,
          amount: share.amount,
        })),
      })
      .single();

    if (error || !expenseRow) {
      const customError = new Error("Failed to update expense", {
        cause: error,
      });
      customError.name = ErrorType.FAILED_TO_UPDATE_EXPENSE;
      throw customError;
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("expenses").delete().eq("id", id);

    if (error) {
      const customError = new Error("Failed to delete expense", {
        cause: error,
      });
      customError.name = ErrorType.FAILED_TO_DELETE_EXPENSE;
      throw customError;
    }
  },
};
