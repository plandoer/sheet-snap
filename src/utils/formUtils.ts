import { ErrorType } from "@/models/enums/errorType";
import { Expense } from "@/models/expense";
import { ExpenseFormData } from "@/models/expenseFormData";
import { googleSheetService } from "@/services/googleSheetService";
import { formatDate } from "./dateUtils";
import { validateForm } from "./validationUtils";

export async function handleForm(
  formData: ExpenseFormData,
  spreadsheetId: string,
  sheetName: string,
): Promise<void> {
  const errors = validateForm(formData);
  if (Object.keys(errors).length > 0) {
    const error = new Error("Invalid form data");
    error.name = ErrorType.INVALID_FORM_DATA;
    return Promise.reject(error);
  }

  if (!spreadsheetId || !sheetName) {
    const error = new Error("No sheet selected");
    error.name = ErrorType.NO_SHEET_SELECTED;
    return Promise.reject(error);
  }
  const totalAmount = parseFloat(formData.amount.trim()) || 0;

  if (formData.selectedPerson === "Both") {
    const halfAmount = totalAmount / 2;

    const yeRowData = getRowData(formData, halfAmount, "Ye");
    const pontRowData = getRowData(formData, halfAmount, "Pont");

    const rows = [yeRowData, pontRowData];

    await googleSheetService.appendToSheet(spreadsheetId, sheetName, rows);
  } else if (formData.splitInHalf) {
    const halfAmount = totalAmount / 2;

    const row1 = getRowData(formData, halfAmount, formData.selectedPerson);
    const row2 = getRowData(formData, halfAmount, formData.selectedPerson);

    const rows = [row1, row2];

    await googleSheetService.appendToSheet(spreadsheetId, sheetName, rows);
  } else {
    const rowData = getRowData(formData, totalAmount, formData.selectedPerson);

    await googleSheetService.appendToSheet(spreadsheetId, sheetName, [rowData]);
  }
}

function getRowData(
  formData: ExpenseFormData,
  amount: number,
  person: string,
): (string | number)[] {
  return [
    formatDate(formData.selectedDate),
    amount,
    person,
    formData.category,
    formData.reason.trim(),
    formData.note.trim(),
  ];
}

export function expensesToExpenseFormDataArray(
  expenses: Expense[] | undefined,
): ExpenseFormData[] {
  if (!expenses || expenses.length === 0) {
    return [];
  }

  return expenses.map(expenseToExpenseFormData);
}

function expenseToExpenseFormData(expense: Expense): ExpenseFormData {
  return {
    selectedDate: expense.date,
    amount: expense.amount,
    reason: expense.reason,
    note: expense.note,
    category: expense.category.name,
    selectedPerson: expense.paidBy.name,
    splitInHalf: expense.splitInHalf,
  };
}
