import FAB from "@/components/FAB";
import { useCreateCategory } from "@/hooks/useCategory";
import { getErrorInfo } from "@/utils/errorUtils";
import { useRef } from "react";
import { Alert } from "react-native";
import CategorySheet, { CategorySheetRef } from "./CategorySheet";

export default function AddCategory() {
  const categoryBottomSheetRef = useRef<CategorySheetRef | null>(null);
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
      <CategorySheet ref={categoryBottomSheetRef} onSave={handleCategoryAdd} />
    </>
  );
}
