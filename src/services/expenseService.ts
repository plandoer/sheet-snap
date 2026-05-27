import { ErrorType } from "@/models/enums/errorType";
import { Expense } from "@/models/expense";
import { Tables, TablesInsert } from "@/models/supabase/database.types";
import { createSubAmounts } from "./subAmountService";
import { getCurrentSupabaseUserId, supabase } from "./supabaseAuthService";

export async function createExpense(expense: Expense): Promise<Expense> {
  const userId = await getCurrentSupabaseUserId();

  const { data: expenseRow, error: expenseError } = await supabase
    .from("expenses")
    .insert(toExpenseRow(expense, userId))
    .select()
    .single();

  if (expenseError || !expenseRow) {
    const customError = new Error("Failed to create expense", {
      cause: expenseError,
    });
    customError.name = ErrorType.FAILED_TO_CREATE_EXPENSE;
    throw customError;
  }

  if (expense.subAmounts.length > 0) {
    await createSubAmounts(expenseRow.id, expense.subAmounts);
  }

  const saved = toExpense(expenseRow);
  saved.subAmounts = expense.subAmounts;
  return saved;
}

export async function getExpenses(): Promise<Expense[]> {
  const { data: expenseRows, error } = await supabase
    .from("expenses")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    const customError = new Error("Failed to fetch expenses", { cause: error });
    customError.name = ErrorType.FAILED_TO_FETCH_EXPENSES;
    throw customError;
  }
  return expenseRows.map(toExpense);
}

function toExpenseRow(
  expense: Expense,
  userId: string,
): TablesInsert<"expenses"> {
  return {
    user_id: userId,
    date: expense.date.toISOString(),
    amount: expense.amount,
    reason: expense.reason || null,
    note: expense.note || null,
    category: expense.category || null,
    currency: expense.currency,
    paid_by: expense.paidBy || null,
    split_in_half: expense.splitInHalf,
    excluded: expense.excluded,
  };
}

function toExpense(row: Tables<"expenses">): Expense {
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
  return expense;
}
