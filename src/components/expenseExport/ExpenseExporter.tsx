import { useSheetContext } from "@/context/SheetContext";
import {
  useArchiveExpenses,
  useExpensesByCurrentGroup,
} from "@/hooks/useExpense";
import { ErrorType } from "@/models/enums/errorType";
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
  [1, "Preparing rows for export"],
  [2, "Exporting rows to sheet"],
  [3, "Export completed"],
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
  const unexportedExpenseCount = expenses?.length ?? 0;

  const [currentPhrase, setCurrentPhrase] = useState(1);

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

    setCurrentPhrase(1);
    openProgressModal();

    try {
      const sortedExpenses = sortExpensesByDateAscending(expenses);
      setCurrentPhrase(2);
      await handleAppendToSheet(sortedExpenses, selectedSheet);
      setCurrentPhrase(3);
      await archiveExpenses();

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
      setCurrentPhrase(1);
    }
  }

  return (
    <>
      {/* Export Button */}
      <ExpenseExportIconButton onPress={openBottomSheet} />

      {/* Bottom Sheet */}
      <ExpenseExportBottomSheet
        ref={bottomSheetRef}
        expenseCount={unexportedExpenseCount}
        selectedSheet={selectedSheet}
        onExport={handleExport}
      />

      {/* Progress Modal */}
      {showProgressModal && (
        <ExpenseExportProgressModal
          visible={showProgressModal}
          currentExpenseFormIndex={currentPhrase - 1}
          exportBatchSize={PHRASES.size}
          sheetTitle={sheetTitle}
        />
      )}
    </>
  );
}
