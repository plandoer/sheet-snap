import { useSheetContext } from "@/context/SheetContext";
import { useExpensesByCurrentGroup } from "@/hooks/useExpense";
import { ErrorType } from "@/models/enums/errorType";
import { getErrorInfo } from "@/utils/errorUtils";
import { expensesToExpenseFormDataArray, handleForm } from "@/utils/formUtils";
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

    const expenseFormDataArray = expensesToExpenseFormDataArray(expenses);
    openProgressModal();

    try {
      for (let i = 0; i < expenseFormDataArray.length; i++) {
        setCurrentExpenseFormIndex(i);
        await handleForm(expenseFormDataArray[i], spreadsheetId, sheetName);
      }

      Alert.alert(
        "Success",
        `${expenseFormDataArray.length} expenses were exported to "${sheetTitle}". You can view them in History.`,
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
