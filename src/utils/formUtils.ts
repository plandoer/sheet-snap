import { SheetSelection } from "@/context/SheetContext";
import { EachShare } from "@/models/eachShare";
import { ErrorType } from "@/models/enums/errorType";
import { Expense } from "@/models/expense";
import { SubAmount } from "@/models/subAmount";
import { googleSheetService } from "@/services/googleSheetService";
import { formatDate } from "./dateUtils";

export async function handleAppendToSheet(
  expense: Expense,
  selectedSheet: SheetSelection | null,
): Promise<void> {
  if (!selectedSheet) {
    const error = new Error("No sheet selected");
    error.name = ErrorType.NO_SHEET_SELECTED;
    return Promise.reject(error);
  }

  const spreadsheetId = selectedSheet.spreadsheet.id;
  const sheetName = selectedSheet.sheet.properties.title;

  const rows = getRows(expense);
  await googleSheetService.appendToSheet(spreadsheetId, sheetName, rows);
}

function getRows(expense: Expense): (string | number)[][] {
  return expense.eachShares.map((share) => getRow(expense, share));
}

function getRow(expense: Expense, share: EachShare): (string | number)[] {
  const reason = getReasonWithSubAmountsReason(
    expense.reason,
    expense.subAmounts,
  );

  return [
    formatDate(expense.date),
    share.amount,
    share.person.name,
    expense.category.name,
    reason,
    expense.note.trim(),
  ];
}

function getReasonWithSubAmountsReason(
  reason: string,
  subAmounts: SubAmount[],
): string {
  if (!subAmounts || subAmounts.length === 0) {
    return reason.trim();
  }

  const subAmountsReason = subAmounts
    .map((sub) => sub.reason.trim())
    .join(", ");
  return `${reason.trim()} (${subAmountsReason})`;
}
