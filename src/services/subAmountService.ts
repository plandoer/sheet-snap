import { ErrorType } from "@/models/enums/errorType";
import { SubAmount } from "@/models/subAmount";
import { Tables, TablesInsert } from "@/models/supabase/database.types";
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
    const customError = new Error("Failed to create sub-amounts", {
      cause: error,
    });
    customError.name = ErrorType.FAILED_TO_CREATE_SUB_AMOUNTS;
    throw customError;
  }
}

export function toSubAmount(row: Tables<"sub_amounts">): SubAmount {
  const sub = new SubAmount();
  sub.id = row.id;
  sub.amount = row.amount;
  sub.reason = row.reason ?? "";
  return sub;
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
