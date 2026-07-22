import Header from "@/components/Header";
import AddPerson from "@/components/persons/AddPerson";
import PersonItems from "@/components/persons/PersonItems";
import PersonSheet from "@/components/persons/PersonSheet";
import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useCreatePerson, usePersons } from "@/hooks/usePersons";
import { getErrorInfo } from "@/utils/errorUtils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { Alert, StyleSheet, View } from "react-native";

export default function Persons() {
  const bottomSheetRef = useRef<BottomSheetModal | null>(null);
  const { data: persons = [], isRefetching, refetch } = usePersons();
  const { mutateAsync: createPersonAsync } = useCreatePerson();

  function openPersonDialog() {
    bottomSheetRef.current?.present();
  }

  async function handlePersonAdd(name: string) {
    try {
      await createPersonAsync(name);
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message);
    }
  }

  function handleDelete() {
    Alert.alert(
      "Coming Soon",
      "Person deletion from this screen is not wired yet.",
    );
  }

  return (
    <View style={styles.screen}>
      <Header title="Persons" />
      <PersonItems
        persons={persons ?? []}
        onRefresh={refetch}
        refreshing={isRefetching}
      />
      <AddPerson onAdd={openPersonDialog} />
      <PersonSheet
        sheetRef={bottomSheetRef}
        onPersonAdd={handlePersonAdd}
        onDelete={handleDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GLOBAL_STYLES.colors.backgroundColor,
  },
});
