import { useSheetContext } from "@/context/SheetContext";
import {
  useArchiveExpense,
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

export default function ExpenseExporter() {
  const bottomSheetRef = useRef<ExpenseExportBottomSheetRef | null>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);

  const { mutateAsync: archiveExpense } = useArchiveExpense();

  const { selectedSheet } = useSheetContext();
  const spreadsheetName = selectedSheet?.spreadsheet.name ?? "";
  const sheetName = selectedSheet?.sheet.properties.title ?? "";
  const sheetTitle = `${spreadsheetName} - ${sheetName}`;

  const { data: expenses } = useExpensesByCurrentGroup();
  const unexportedExpenseCount = expenses?.length ?? 0;

  const [currentExpenseFormIndex, setCurrentExpenseFormIndex] = useState(0);
  const [exportBatchSize, setExportBatchSize] = useState(0);

  const appendedUnarchivedExpenseIds = useRef(new Set<string>());

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

    setExportBatchSize(expenses.length);
    openProgressModal();

    try {
      const sortedExpenses = sortExpensesByDateAscending(expenses);
      for (let i = 0; i < sortedExpenses.length; i++) {
        setCurrentExpenseFormIndex(i);

        const expense = sortedExpenses[i];
        await appendToSheetOnce(expense);
        await archiveExpense(expense.id);
        markExpenseFullyExported(expense.id);
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

  async function appendToSheetOnce(expense: Expense) {
    if (!appendedUnarchivedExpenseIds.current.has(expense.id)) {
      await handleAppendToSheet([expense], selectedSheet);
      appendedUnarchivedExpenseIds.current.add(expense.id);
    }
  }

  function markExpenseFullyExported(expenseId: string) {
    appendedUnarchivedExpenseIds.current.delete(expenseId);
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
          currentExpenseFormIndex={currentExpenseFormIndex}
          exportBatchSize={exportBatchSize}
          sheetTitle={sheetTitle}
        />
      )}
    </>
  );
}
