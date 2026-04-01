import { supabase } from "./supabaseAuthService";

export async function getExpenses() {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;
  return (data as DbExpense[]).map((row) => toExpense(row, userId));
}
