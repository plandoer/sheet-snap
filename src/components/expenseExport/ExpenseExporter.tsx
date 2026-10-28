import { useSheetContext } from "@/context/SheetContext";
import {
  useArchiveExpenses,
  useExpensesByCurrentGroup,
} from "@/hooks/useExpense";
import { ErrorType } from "@/models/enums/errorType";
import { Expense } from "@/models/expense";
import { getErrorInfo } from "@/utils/errorUtils";
import { sortExpensesByDateAscending } from "@/utils/expenseUtils";
import { handleAppendToSheet } from "@/utils/formUtils";
import { useRef, useState } from "react";
import { Alert } from "react-native";
import ExpenseExportBottomSheet, {
  ExpenseExportBottomSheetRef,
} from "./ExpenseExportBottomSheet";
import ExpenseExportIconButton from "./ExpenseExportIconButton";
import ExpenseExportProgressModal from "./ExpenseExportProgressModal";

const PHRASES = new Map([
  [1, "Preparing export..."],
  [2, "Exporting to Google Sheets..."],
  [3, "Archiving expenses..."],
]);

export default function ExpenseExporter() {
  const bottomSheetRef = useRef<ExpenseExportBottomSheetRef | null>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);

  const { mutateAsync: archiveExpenses } = useArchiveExpenses();

  const { selectedSheet } = useSheetContext();
  const spreadsheetName = selectedSheet?.spreadsheet.name ?? "";
  const sheetName = selectedSheet?.sheet.properties.title ?? "";
  const sheetTitle = `${spreadsheetName} - ${sheetName}`;

  const { data: expenses } = useExpensesByCurrentGroup();

  const [currentPhrase, setCurrentPhrase] = useState(1);
  const expenseExported = useRef(false);

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
    if (!expenses || expenses.length === 0) {
      const error = new Error("No expenses to export");
      error.name = ErrorType.NO_EXPENSES_TO_EXPORT;
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message);
      return;
    }

    openProgressModal();

    try {
      setCurrentPhrase(1);
      const sortedExpenses = sortExpensesByDateAscending(expenses);

      setCurrentPhrase(2);
      await exportExpenses(sortedExpenses);

      setCurrentPhrase(3);
      await archiveExpenses();

      resetExportState();

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
    }
  }

  async function exportExpenses(sortedExpenses: Expense[]) {
    if (expenseExported.current) return;
    await handleAppendToSheet(sortedExpenses, selectedSheet);
    expenseExported.current = true;
  }

  function resetExportState() {
    setCurrentPhrase(1);
    expenseExported.current = false;
  }

  return (
    <>
      {/* Export Button */}
      <ExpenseExportIconButton onPress={openBottomSheet} />

      {/* Bottom Sheet */}
      <ExpenseExportBottomSheet
        ref={bottomSheetRef}
        expenseCount={expenses?.length ?? 0}
        selectedSheet={selectedSheet}
        onExport={handleExport}
      />

      {/* Progress Modal */}
      {showProgressModal && (
        <ExpenseExportProgressModal
          visible={showProgressModal}
          currentNumber={currentPhrase}
          total={PHRASES.size}
          text={PHRASES.get(currentPhrase) ?? ""}
        />
      )}
    </>
  );
}
