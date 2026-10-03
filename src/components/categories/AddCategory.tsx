import FAB from "@/components/FAB";
import { useCreateCategory } from "@/hooks/useCategory";
import { getErrorInfo } from "@/utils/errorUtils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { Alert } from "react-native";
import CategorySheet from "./CategorySheet";

export default function AddCategory() {
  const categoryBottomSheetRef = useRef<BottomSheetModal | null>(null);
  const { mutateAsync: createCategoryAsync } = useCreateCategory();

  async function handleCategoryAdd(name: string) {
    try {
      await createCategoryAsync(name);
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message);
    }
  }

  function openCategoryDialog() {
    categoryBottomSheetRef.current?.present();
  }

  return (
    <>
      {/* Add Button */}
      <FAB onPress={openCategoryDialog} />

      {/* Category Bottom Sheet */}
      <CategorySheet
        sheetRef={categoryBottomSheetRef}
        onSave={handleCategoryAdd}
      />
    </>
  );
}
