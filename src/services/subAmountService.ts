import { ErrorType } from "@/models/enums/errorType";
import { SubAmount } from "@/models/subAmount";
import { toSubAmountRow } from "@/utils/subAmountUtils";
import { supabase } from "./supabaseAuthService";

export const subAmountService = {
  async create(expenseId: string, subAmounts: SubAmount[]): Promise<void> {
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
  },
};
