import { useSheetContext } from "@/context/SheetContext";
import { ErrorType } from "@/models/enums/errorType";
import type { SheetForm } from "@/models/sheetForm";
import { getErrorInfo } from "@/utils/errorUtils";
import { handleForm } from "@/utils/formUtils";
import { useRef, useState } from "react";
import { Alert } from "react-native";
import IconButton from "../IconButton";
import type { SheetSaveBottomSheetRef } from "./SheetSaveBottomSheet";
import SheetSaveBottomSheet from "./SheetSaveBottomSheet";
import SheetSaveProgressModal from "./SheetSaveProgressModal";

export default function SheetSaveButton() {
  const bottomSheetRef = useRef<SheetSaveBottomSheetRef | null>(null);

  const [showProgressModal, setShowProgressModal] = useState(false);
  const [sheetForms, setSheetForms] = useState<SheetForm[]>([]);
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);
  const { selectedSheet } = useSheetContext();

  function openSheetSaveDialog() {
    bottomSheetRef.current?.present();
  }

  async function saveSheet(sheetForms: SheetForm[]): Promise<Error | void> {
    if (!selectedSheet) {
      const error = new Error("No sheet selected");
      error.name = ErrorType.NO_SHEET_SELECTED;
      return Promise.reject(error);
    }

    for (let i = 0; i < sheetForms.length; i++) {
      setCurrentSheetIndex(i);
      await handleForm(
        sheetForms[i],
        selectedSheet?.spreadsheet.id,
        selectedSheet?.spreadsheet.name,
      );
    }
  }

  async function handleSheetSave(sheetForms: SheetForm[]) {
    setSheetForms(sheetForms);
    setShowProgressModal(true);
    try {
      await saveSheet(sheetForms);
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message);
      console.error("Error during sheet save:", error);
    } finally {
      setShowProgressModal(false);
    }
  }

  return (
    <>
      {/* Sheet Save Button */}
      <IconButton name="cloud-upload-outline" onPress={openSheetSaveDialog} />

      {/* Sheet Save Bottom Sheet */}
      <SheetSaveBottomSheet
        ref={bottomSheetRef}
        onSave={(sheetForms) => handleSheetSave(sheetForms)}
      />

      {/* Save Progress Modal */}
      <SheetSaveProgressModal
        visible={showProgressModal}
        totalSheets={sheetForms.length}
        currentSheetIndex={currentSheetIndex}
      />
    </>
  );
}
