import FAB from "@/components/FAB";
import { useCreatePerson } from "@/hooks/usePerson";
import { getErrorInfo } from "@/utils/errorUtils";
import { useRef } from "react";
import { Alert } from "react-native";
import PersonSheet, { PersonSheetRef } from "./PersonSheet";

export default function AddPerson() {
  const personBottomSheetRef = useRef<PersonSheetRef | null>(null);
  const { mutateAsync: createPersonAsync } = useCreatePerson();

  async function handlePersonAdd(name: string) {
    try {
      await createPersonAsync(name);
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
      <PersonSheet ref={personBottomSheetRef} onSave={handlePersonAdd} />
    </>
  );
}
