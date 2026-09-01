import { ErrorType } from "@/models/enums/errorType";
import { Expense } from "@/models/expense";
import { flattenRelatedPersonIds, toExpense } from "@/utils/expenseUtils";
import { personService } from "./personService";
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
      .select("*, sub_amounts(*), each_shares(*)")
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

    const personsById = await personService.getByIds(
      flattenRelatedPersonIds(expenseRows),
    );

    return expenseRows.map((row) => toExpense(row, personsById));
  },

  async getNotExcluded(): Promise<Expense[]> {
    const { data: expenseRows, error } = await supabase
      .from("expenses")
      .select("*, sub_amounts(*), each_shares(*)")
      .eq("excluded", false)
      .order("date", { ascending: false });

    if (error) {
      const customError = new Error("Failed to fetch non-excluded expenses", {
        cause: error,
      });
      customError.name = ErrorType.FAILED_TO_FETCH_EXPENSES;
      throw customError;
    }

    const personsById = await personService.getByIds(
      flattenRelatedPersonIds(expenseRows),
    );

    return expenseRows.map((row) => toExpense(row, personsById));
  },

  async getById(id: string): Promise<Expense> {
    const { data: expenseRow, error } = await supabase
      .from("expenses")
      .select("*, sub_amounts(*), each_shares(*)")
      .eq("id", id)
      .single();

    if (error || !expenseRow) {
      const customError = new Error("Failed to fetch expense by id", {
        cause: error,
      });
      customError.name = ErrorType.FAILED_TO_FETCH_EXPENSE_BY_ID;
      throw customError;
    }

    const personsById = await personService.getByIds(
      flattenRelatedPersonIds([expenseRow]),
    );
    return toExpense(expenseRow, personsById);
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
