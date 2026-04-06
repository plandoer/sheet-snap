import { Expense } from "@/models/expense";
import { SubAmount } from "@/models/subAmount";
import { Tables } from "../models/supabase/database.types";
import { supabase } from "./supabaseAuthService";

type ExpenseRow = Tables<"expenses">;

export async function getExpenses() {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;

  const expenses = data.map((row: ExpenseRow) => ({
    id: row.id,
    userId: row.user_id,
    date: new Date(row.date),
    amount: row.amount,
    subAmounts: row.sub_amounts || [],
    reason: row.reason || "",
    note: row.note || "",
    category: row.category || "",
    currency: row.currency || "",
    paidBy: row.paid_by || "",
    splitInHalf: row.split_in_half || false,
    excluded: row.excluded || false,
    createdAt: row.created_at,
  }));

  return expenses;
}

function toExpense(row: ExpenseRow, currentUserId: string): Expense {
  const expense = new Expense();
  expense.id = row.id;
  expense.userId = row.user_id;
  expense.date = new Date(row.date);
  expense.amount = row.amount;
  expense.subAmounts = ((row.sub_amounts || []) as unknown as SubAmount[]).map(
    (s) => {
      const sub = new SubAmount();
      sub.id = s.id;
      sub.amount = s.amount;
      sub.reason = s.reason;
      return sub;
    },
  );
  expense.note = row.note || "";
  expense.category = row.category || "";
  expense.currency = row.currency || "";
  expense.paidBy = row.paid_by || "";
  expense.splitInHalf = row.split_in_half || false;
  expense.excluded = row.excluded || false;
  expense.createdAt = row.created_at;
  return expense;
}
