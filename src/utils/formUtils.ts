import { ErrorType } from "@/models/enums/errorType";
import { SheetFormData } from "@/models/form";
import { appendToGoogleSheet } from "@/services/googleSheetService";
import { formatDate } from "./dateUtils";

export async function handleForm(
  formData: SheetFormData,
  spreadsheetId: string,
  sheetName: string,
): Promise<void> {
  if (!isValidForm(formData)) {
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

    await appendToGoogleSheet(spreadsheetId, sheetName, rows);
  } else if (formData.splitInHalf) {
    const halfAmount = totalAmount / 2;

    const row1 = getRowData(formData, halfAmount, formData.selectedPerson);
    const row2 = getRowData(formData, halfAmount, formData.selectedPerson);

    const rows = [row1, row2];

    await appendToGoogleSheet(spreadsheetId, sheetName, rows);
  } else {
    const rowData = getRowData(formData, totalAmount, formData.selectedPerson);

    await appendToGoogleSheet(spreadsheetId, sheetName, [rowData]);
  }
}

function isValidForm(formData: SheetFormData): boolean {
  return (
    formData.amount.trim() !== "" &&
    formData.reason.trim() !== "" &&
    formData.category !== "" &&
    formData.selectedPerson !== ""
  );
}

function getRowData(
  formData: SheetFormData,
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
