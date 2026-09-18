import FAB from "@/components/FAB";
import { useGroupContext } from "@/context/GroupContext";
import { useCreatePerson } from "@/hooks/usePerson";
import { getErrorInfo } from "@/utils/errorUtils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { Alert } from "react-native";
import PersonSheet from "./PersonSheet";

export default function AddPerson() {
  const personBottomSheetRef = useRef<BottomSheetModal | null>(null);
  const { currentGroup } = useGroupContext();
  const { mutateAsync: createPersonAsync } = useCreatePerson();

  async function handlePersonAdd(name: string) {
    if (!currentGroup) {
      Alert.alert("Error", "No current group selected.");
      return;
    }

    try {
      await createPersonAsync({ name, groupId: currentGroup.id });
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message);
    }
  }

  function openPersonDialog() {
    personBottomSheetRef.current?.present();
  }

  return (
    <>
      {/* Add Button */}
      <FAB onPress={openPersonDialog} />

      {/* Person Bottom Sheet */}
      <PersonSheet sheetRef={personBottomSheetRef} onSave={handlePersonAdd} />
    </>
  );
}
