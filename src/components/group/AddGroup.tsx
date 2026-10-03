import FAB from "@/components/FAB";
import { useCreateGroup } from "@/hooks/useGroup";
import { getErrorInfo } from "@/utils/errorUtils";
import { useRef } from "react";
import { Alert } from "react-native";
import GroupSheet, { GroupSheetRef } from "./GroupSheet";

export default function AddGroup() {
  const groupBottomSheetRef = useRef<GroupSheetRef | null>(null);
  const { mutateAsync: createGroupAsync } = useCreateGroup();

  async function handleGroupAdd(name: string) {
    try {
      await createGroupAsync(name);
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message);
    }
  }

  function openGroupDialog() {
    groupBottomSheetRef.current?.present();
  }

  return (
    <>
      {/* Add Button */}
      <FAB onPress={openGroupDialog} />

      {/* Expense Group Bottom Sheet */}
      <GroupSheet ref={groupBottomSheetRef} onSave={handleGroupAdd} />
    </>
  );
}
