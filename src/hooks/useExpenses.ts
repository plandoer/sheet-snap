import { Expense } from "@/models/expense";
import { SubAmount } from "@/models/subAmount";
import { supabase } from "@/utils/supabase";

// ── DB row types ──────────────────────────────────────────────────────────────

interface DbSubAmount {
  id: string;
  amount: string;
  reason: string;
}

interface DbExpense {
  id: string;
  user_id: string;
  date: string;
  amount: string;
  sub_amounts: DbSubAmount[];
  reason: string | null;
  note: string | null;
  category: string | null;
  currency: string;
  paid_by: string | null;
  split_in_half: boolean;
  excluded: boolean;
  created_at: string;
}

// ── Mapping helpers ───────────────────────────────────────────────────────────

function toExpense(row: DbExpense, currentUserId: string): Expense {
  const expense = new Expense();
  expense.id = row.id;
  expense.date = new Date(row.date);
  expense.amount = row.amount;
  expense.subAmounts = (row.sub_amounts ?? []).map((s) => {
    const sub = new SubAmount();
    sub.id = s.id;
    sub.amount = s.amount;
    sub.reason = s.reason;
    return sub;
  });
  expense.reason = row.reason ?? "";
  expense.note = row.note ?? "";
  expense.category = row.category ?? "";
  expense.currency = row.currency;
  expense.paidBy = row.paid_by ?? "";
  expense.splitInHalf = row.split_in_half;
  expense.excluded = row.excluded;
  expense.isOwner = row.user_id === currentUserId;
  return expense;
}

function toDbRow(
  expense: Expense,
  userId: string,
): Omit<DbExpense, "id" | "created_at"> {
  return {
    user_id: userId,
    date: expense.date.toISOString(),
    amount: expense.amount,
    sub_amounts: expense.subAmounts.map((s) => ({
      id: s.id,
      amount: s.amount,
      reason: s.reason,
    })),
    reason: expense.reason || null,
    note: expense.note || null,
    category: expense.category || null,
    currency: expense.currency,
    paid_by: expense.paidBy || null,
    split_in_half: expense.splitInHalf,
    excluded: expense.excluded,
  };
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useExpenses() {
  async function getCurrentUserId(): Promise<string> {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw new Error("Not authenticated");
    return data.user.id;
  }

  async function getExpenses(): Promise<Expense[]> {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("date", { ascending: false });

    if (error) throw error;
    return (data as DbExpense[]).map((row) => toExpense(row, userId));
  }

  async function createExpense(expense: Expense): Promise<Expense> {
    const userId = await getCurrentUserId();
    const row = toDbRow(expense, userId);

    const { data, error } = await supabase
      .from("expenses")
      .insert(row)
      .select()
      .single();

    if (error) throw error;
    return toExpense(data as DbExpense, userId);
  }

  async function updateExpense(
    id: string,
    expense: Partial<Expense>,
  ): Promise<Expense> {
    const userId = await getCurrentUserId();

    const partialRow: Partial<
      Omit<DbExpense, "id" | "created_at" | "user_id">
    > = {};
    if (expense.date !== undefined)
      partialRow.date = expense.date.toISOString();
    if (expense.amount !== undefined) partialRow.amount = expense.amount;
    if (expense.subAmounts !== undefined)
      partialRow.sub_amounts = expense.subAmounts.map((s) => ({
        id: s.id,
        amount: s.amount,
        reason: s.reason,
      }));
    if (expense.reason !== undefined)
      partialRow.reason = expense.reason || null;
    if (expense.note !== undefined) partialRow.note = expense.note || null;
    if (expense.category !== undefined)
      partialRow.category = expense.category || null;
    if (expense.currency !== undefined) partialRow.currency = expense.currency;
    if (expense.paidBy !== undefined)
      partialRow.paid_by = expense.paidBy || null;
    if (expense.splitInHalf !== undefined)
      partialRow.split_in_half = expense.splitInHalf;
    if (expense.excluded !== undefined) partialRow.excluded = expense.excluded;

    const { data, error } = await supabase
      .from("expenses")
      .update(partialRow)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return toExpense(data as DbExpense, userId);
  }

  async function deleteExpense(id: string): Promise<void> {
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) throw error;
  }

  return { getExpenses, createExpense, updateExpense, deleteExpense };
}
