import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import IconButton from "../IconButton";
import SheetSaveBottomSheet from "./SheetSaveBottomSheet";

interface Props {
  expenseCount: number;
}

export default function SheetSaveButton({ expenseCount }: Props) {
  const bottomSheetRef = useRef<BottomSheetModal | null>(null);

  function openSheetSaveDialog() {
    bottomSheetRef.current?.present();
  }

  return (
    <>
      {/* Sheet Save Button */}
      <IconButton name="cloud-upload-outline" onPress={openSheetSaveDialog} />

      {/* Sheet Save Bottom Sheet */}
      <SheetSaveBottomSheet
        sheetRef={bottomSheetRef}
        expenseCount={expenseCount}
      />
    </>
  );
}
