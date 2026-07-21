import Header from "@/components/Header";
import AddPerson from "@/components/persons/AddPerson";
import PersonItems from "@/components/persons/PersonItems";
import PersonSheet from "@/components/persons/PersonSheet";
import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Person } from "@/models/person";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { StyleSheet, View } from "react-native";

const persons: Person[] = [
  {
    id: "1",
    name: "John Doe",
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "2",
    name: "Jane Smith",
    createdAt: new Date("2023-02-15"),
  },
  {
    id: "3",
    name: "Alice Johnson",
    createdAt: new Date("2023-03-10"),
  },
];

export default function Persons() {
  const bottomSheetRef = useRef<BottomSheetModal | null>(null);

  function openPersonDialog() {
    bottomSheetRef.current?.present();
  }

  return (
    <View style={styles.screen}>
      <Header title="Persons" />
      <PersonItems
        persons={persons ?? []}
        onRefresh={() => {}}
        refreshing={false}
      />
      <AddPerson onAdd={openPersonDialog} />
      <PersonSheet sheetRef={bottomSheetRef} onPersonAdd={(name) => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GLOBAL_STYLES.colors.backgroundColor,
  },
});
