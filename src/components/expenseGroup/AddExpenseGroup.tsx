import FAB from "@/components/FAB";
import { useCreateExpenseGroup } from "@/hooks/useExpenseGroup";
import { getErrorInfo } from "@/utils/errorUtils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { Alert } from "react-native";
import ExpenseGroupSheet from "./ExpenseGroupSheet";

export default function AddExpenseGroup() {
  const expenseGroupBottomSheetRef = useRef<BottomSheetModal | null>(null);
  const { mutateAsync: createExpenseGroupAsync } = useCreateExpenseGroup();

  async function handleExpenseGroupAdd(name: string) {
    try {
      await createExpenseGroupAsync(name);
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message);
    }
  }

  function openExpenseGroupDialog() {
    expenseGroupBottomSheetRef.current?.present();
  }

  return (
    <>
      {/* Add Button */}
      <FAB onPress={openExpenseGroupDialog} />

      {/* Expense Group Bottom Sheet */}
      <ExpenseGroupSheet
        sheetRef={expenseGroupBottomSheetRef}
        onSave={handleExpenseGroupAdd}
      />
    </>
  );
}
