import { ErrorType } from "@/models/enums/errorType";
import { Expense } from "@/models/expense";
import { Tables } from "@/models/supabase/database.types";
import { toSubAmount } from "./subAmountService";
import { getCurrentSupabaseUserId, supabase } from "./supabaseAuthService";

export async function createExpense(expense: Expense): Promise<Expense> {
  const userId = await getCurrentSupabaseUserId();

  const { data: expenseRow, error } = await supabase
    .rpc("create_expense_with_sub_amounts", {
      p_user_id: userId,
      p_date: expense.date.toISOString(),
      p_amount: expense.amount,
      p_reason: expense.reason || null,
      p_note: expense.note || null,
      p_category: expense.category || null,
      p_currency: expense.currency,
      p_paid_by: expense.paidBy || null,
      p_split_in_half: expense.splitInHalf,
      p_excluded: expense.excluded,
      p_sub_amounts: expense.subAmounts.map((s) => ({
        amount: s.amount,
        reason: s.reason,
      })),
    })
    .single();

  if (error || !expenseRow) {
    const customError = new Error("Failed to create expense", { cause: error });
    customError.name = ErrorType.FAILED_TO_CREATE_EXPENSE;
    throw customError;
  }

  const saved = toExpense(expenseRow);
  return saved;
}

export async function getExpenses(): Promise<Expense[]> {
  const { data: expenseRows, error } = await supabase
    .from("expenses")
    .select("*, sub_amounts(*)")
    .order("date", { ascending: false });

  if (error) {
    const customError = new Error("Failed to fetch expenses", { cause: error });
    customError.name = ErrorType.FAILED_TO_FETCH_EXPENSES;
    throw customError;
  }
  return expenseRows.map(toExpense);
}

function toExpense(
  row: Tables<"expenses"> & { sub_amounts?: Tables<"sub_amounts">[] },
): Expense {
  const expense = new Expense();
  expense.id = row.id;
  expense.userId = row.user_id;
  expense.date = new Date(row.date);
  expense.amount = row.amount;
  expense.reason = row.reason ?? "";
  expense.note = row.note ?? "";
  expense.category = row.category ?? "";
  expense.currency = row.currency;
  expense.paidBy = row.paid_by ?? "";
  expense.splitInHalf = row.split_in_half;
  expense.excluded = row.excluded;
  expense.createdAt = row.created_at;
  expense.subAmounts = (row.sub_amounts ?? []).map(toSubAmount);
  return expense;
}
