import { SheetFormData } from "@/models/form";
import { appendToGoogleSheet } from "@/services/google-drive";
import { Alert } from "react-native";
import { formatDate } from "./dateUtils";

export async function handleForm(
  formData: SheetFormData,
  spreadsheetId: string,
  sheetName: string
) {
  if (!isValidForm(formData)) {
    Alert.alert("Error", "Please fill in all required fields");
    return;
  }

  if (!spreadsheetId || !sheetName) {
    Alert.alert("Error", "Please select a Google Sheet first");
    return;
  }

  try {
    const totalAmount = parseFloat(formData.amount.trim()) || 0;

    if (formData.selectedPerson === "Both") {
      const halfAmount = totalAmount / 2;

      const yeRowData = getRowData(formData, halfAmount, "Ye");
      const pontRowData = getRowData(formData, halfAmount, "Pont");

      const rows = [yeRowData, pontRowData];

      for (const rowData of rows) {
        await appendToGoogleSheet(spreadsheetId, sheetName, rowData);
      }
    } else {
      const rowData = getRowData(
        formData,
        totalAmount,
        formData.selectedPerson
      );

      await appendToGoogleSheet(spreadsheetId, sheetName, rowData);
    }

    Alert.alert("Success", "Data saved to Google Sheet successfully!");
  } catch (error) {
    console.error("Error saving to sheet:", error);
    Alert.alert(
      "Error",
      "Failed to save data to Google Sheet. Please try again."
    );
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
  person: string
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

function saveToGoogleSheet() {}
