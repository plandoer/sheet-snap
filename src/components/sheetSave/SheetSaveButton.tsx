import { useRef } from "react";
import IconButton from "../IconButton";
import type { SheetSaveBottomSheetRef } from "./SheetSaveBottomSheet";
import SheetSaveBottomSheet from "./SheetSaveBottomSheet";

export default function SheetSaveButton() {
  const bottomSheetRef = useRef<SheetSaveBottomSheetRef | null>(null);

  function openSheetSaveDialog() {
    bottomSheetRef.current?.present();
  }

  function handleSheetSave() {}

  return (
    <>
      {/* Sheet Save Button */}
      <IconButton name="cloud-upload-outline" onPress={openSheetSaveDialog} />

      {/* Sheet Save Bottom Sheet */}
      <SheetSaveBottomSheet ref={bottomSheetRef} onSave={handleSheetSave} />
    </>
  );
}
