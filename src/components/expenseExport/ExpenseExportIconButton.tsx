import { useSheetContext } from "@/context/SheetContext";
import { ErrorType } from "@/models/enums/errorType";
import type { ExpenseFormData } from "@/models/expenseFormData";
import { getErrorInfo } from "@/utils/errorUtils";
import { handleForm } from "@/utils/formUtils";
import { useRef, useState } from "react";
import { Alert } from "react-native";
import IconButton from "../IconButton";
import type { ExpenseExportBottomSheetRef } from "./ExpenseExportBottomSheet";
import ExpenseExportBottomSheet from "./ExpenseExportBottomSheet";
import ExpenseExportProgressModal from "./ExpenseExportProgressModal";

export default function ExpenseExportIconButton() {
  const bottomSheetRef = useRef<ExpenseExportBottomSheetRef | null>(null);

  const [showProgressModal, setShowProgressModal] = useState(false);
  const [expenseFormDataCount, setExpenseFormDataCount] = useState(0);
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);
  const { selectedSheet } = useSheetContext();

  const sheetTitle = `${selectedSheet?.spreadsheet.name} - ${selectedSheet?.sheet.properties.title}`;

  function openExpenseExportDialog() {
    bottomSheetRef.current?.present();
  }

  async function exportExpenseFormDataArray(
    expenseFormDataArray: ExpenseFormData[],
  ): Promise<Error | void> {
    if (!selectedSheet) {
      const error = new Error("No sheet selected");
      error.name = ErrorType.NO_SHEET_SELECTED;
      return Promise.reject(error);
    }

    for (let i = 0; i < expenseFormDataArray.length; i++) {
      setCurrentSheetIndex(i);
      await handleForm(
        expenseFormDataArray[i],
        selectedSheet.spreadsheet.id,
        selectedSheet.sheet.properties.title,
      );
    }
  }

  async function handleExpenseFormDataArray(
    expenseFormDataArray: ExpenseFormData[],
  ) {
    setExpenseFormDataCount(expenseFormDataArray.length);
    setShowProgressModal(true);
    try {
      await exportExpenseFormDataArray(expenseFormDataArray);
      showSuccess(expenseFormDataArray.length);
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message, [
        {
          text: "Try Again",
          onPress: () => handleExpenseFormDataArray(expenseFormDataArray),
        },
        { text: "Cancel" },
      ]);
      console.error("Error during sheet save:", error);
    } finally {
      setShowProgressModal(false);
      setCurrentSheetIndex(0);
    }
  }

  function showSuccess(count: number) {
    Alert.alert(
      "Success",
      `${count} expenses were exported to "${sheetTitle}". You can view them in History.`,
    );
  }

  return (
    <>
      {/* Sheet Save Button */}
      <IconButton
        name="cloud-upload-outline"
        onPress={openExpenseExportDialog}
      />

      {/*  Bottom Sheet */}
      <ExpenseExportBottomSheet
        ref={bottomSheetRef}
        onSave={(expenseFormDataArray) =>
          handleExpenseFormDataArray(expenseFormDataArray)
        }
      />

      {/* Save Progress Modal */}
      <ExpenseExportProgressModal
        visible={showProgressModal}
        sheetTitle={sheetTitle}
        expenseFormDataCount={expenseFormDataCount}
        currentSheetIndex={currentSheetIndex}
      />
    </>
  );
}
