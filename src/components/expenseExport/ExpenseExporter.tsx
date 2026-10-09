import { useSheetContext } from "@/context/SheetContext";
import {
  useArchiveExpense,
  useExpensesByCurrentGroup,
} from "@/hooks/useExpense";
import { ErrorType } from "@/models/enums/errorType";
import { getErrorInfo } from "@/utils/errorUtils";
import {
  expenseToExpenseFormData,
  handleForm,
  sortExpensesByDateAscending,
} from "@/utils/formUtils";
import { useRef, useState } from "react";
import { Alert } from "react-native";
import ExpenseExportBottomSheet, {
  ExpenseExportBottomSheetRef,
} from "./ExpenseExportBottomSheet";
import ExpenseExportIconButton from "./ExpenseExportIconButton";
import ExpenseExportProgressModal from "./ExpenseExportProgressModal";

export default function ExpenseExporter() {
  const bottomSheetRef = useRef<ExpenseExportBottomSheetRef | null>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);

  const { mutateAsync: archiveExpense } = useArchiveExpense();

  const { selectedSheet } = useSheetContext();
  const spreadsheetId = selectedSheet?.spreadsheet.id ?? "";
  const spreadsheetName = selectedSheet?.spreadsheet.name ?? "";
  const sheetName = selectedSheet?.sheet.properties.title ?? "";
  const sheetTitle = `${spreadsheetName} - ${sheetName}`;

  const { data: expenses } = useExpensesByCurrentGroup();
  const expenseCount = expenses?.length ?? 0;

  const [currentExpenseFormIndex, setCurrentExpenseFormIndex] = useState(0);

  function openBottomSheet() {
    bottomSheetRef.current?.present();
  }

  function openProgressModal() {
    setShowProgressModal(true);
  }

  function closeProgressModal() {
    setShowProgressModal(false);
  }

  async function handleExport() {
    if (!selectedSheet) {
      const error = new Error("No sheet selected");
      error.name = ErrorType.NO_SHEET_SELECTED;
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message);
      return;
    }

    if (!expenses || expenses.length === 0) {
      const error = new Error("No expenses to export");
      error.name = ErrorType.NO_EXPENSES_TO_EXPORT;
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message);
      return;
    }

    openProgressModal();

    try {
      const sortedExpenses = sortExpensesByDateAscending(expenses);
      for (let i = 0; i < sortedExpenses.length; i++) {
        setCurrentExpenseFormIndex(i);

        const expense = sortedExpenses[i];
        const expenseFormData = expenseToExpenseFormData(expense);
        await handleForm(expenseFormData, spreadsheetId, sheetName);
        await archiveExpense(expense.id);
      }

      Alert.alert(
        "Success",
        `${expenses.length} expenses were exported to "${sheetTitle}". You can view them in History.`,
      );
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message, [
        { text: "Try Again", onPress: handleExport },
        { text: "Cancel" },
      ]);
      console.error("Error during sheet export:", error);
    } finally {
      closeProgressModal();
      setCurrentExpenseFormIndex(0);
    }
  }

  return (
    <>
      {/* Export Button */}
      <ExpenseExportIconButton onPress={openBottomSheet} />

      {/* Bottom Sheet */}
      <ExpenseExportBottomSheet
        ref={bottomSheetRef}
        expenseCount={expenseCount}
        selectedSheet={selectedSheet}
        onExport={handleExport}
      />

      {/* Progress Modal */}
      {showProgressModal && (
        <ExpenseExportProgressModal
          visible={showProgressModal}
          currentExpenseFormIndex={currentExpenseFormIndex}
          expenseCount={expenseCount}
          sheetTitle={sheetTitle}
        />
      )}
    </>
  );
}
