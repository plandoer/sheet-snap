import { useSheetContext } from "@/context/SheetContext";
import { ErrorType } from "@/models/enums/errorType";
import type { ExpenseFormData } from "@/models/expenseFormData";
import { getErrorInfo } from "@/utils/errorUtils";
import { handleForm } from "@/utils/formUtils";
import { useRef, useState } from "react";
import { Alert } from "react-native";
import IconButton from "../IconButton";
import type { ExportExpenseBottomSheetRef } from "./ExportExpenseBottomSheet";
import ExportExpenseBottomSheet from "./ExportExpenseBottomSheet";
import ExportExpenseProgressModal from "./ExportExpenseProgressModal";

export default function ExportExpenseIconButton() {
  const bottomSheetRef = useRef<ExportExpenseBottomSheetRef | null>(null);

  const [showProgressModal, setShowProgressModal] = useState(false);
  const [expenseFormDataCount, setExpenseFormDataCount] = useState(0);
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);
  const { selectedSheet } = useSheetContext();

  const sheetTitle = `${selectedSheet?.spreadsheet.name} - ${selectedSheet?.sheet.properties.title}`;

  function openExportExpenseDialog() {
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
      showSuccess();
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

  function showSuccess() {
    Alert.alert(
      "Saved Successfully",
      `${expenseFormDataCount} expenses were saved to "${sheetTitle}". You can view them in History.`,
    );
  }

  return (
    <>
      {/* Sheet Save Button */}
      <IconButton
        name="cloud-upload-outline"
        onPress={openExportExpenseDialog}
      />

      {/* Sheet Save Bottom Sheet */}
      <ExportExpenseBottomSheet
        ref={bottomSheetRef}
        onSave={(expenseFormDataArray) =>
          handleExpenseFormDataArray(expenseFormDataArray)
        }
      />

      {/* Save Progress Modal */}
      <ExportExpenseProgressModal
        visible={showProgressModal}
        sheetTitle={sheetTitle}
        expenseFormDataCount={expenseFormDataCount}
        currentSheetIndex={currentSheetIndex}
      />
    </>
  );
}
