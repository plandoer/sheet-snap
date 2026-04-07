import { SubAmount } from "@/models/subAmount";
import { TablesInsert } from "@/models/supabase/database.types";
import { supabase } from "./supabaseAuthService";

export async function createSubAmounts(
  expenseId: string,
  subAmounts: SubAmount[],
): Promise<void> {
  if (subAmounts.length === 0) return;

  const { error } = await supabase
    .from("sub_amounts")
    .insert(subAmounts.map((sub) => toSubAmountRow(sub, expenseId)));

  if (error) {
    throw new Error(error.message);
  }
}

function toSubAmountRow(
  subAmount: SubAmount,
  expenseId: string,
): TablesInsert<"sub_amounts"> {
  return {
    expense_id: expenseId,
    amount: subAmount.amount,
    reason: subAmount.reason || null,
  };
}
