import { SubAmount } from "@/models/subAmount";
import { Tables, TablesInsert } from "@/models/supabase/database.types";

export function toSubAmountRow(
  subAmount: SubAmount,
  expenseId: string,
): TablesInsert<"sub_amounts"> {
  return {
    expense_id: expenseId,
    amount: subAmount.amount,
    reason: subAmount.reason || null,
  };
}

export function toSubAmount(row: Tables<"sub_amounts">): SubAmount {
  const sub = new SubAmount();
  sub.id = row.id;
  sub.amount = row.amount;
  sub.reason = row.reason ?? "";
  return sub;
}
