import Header from "@/components/Header";
import AddPerson from "@/components/persons/AddPerson";
import PersonItems from "@/components/persons/PersonItems";
import { GLOBAL_STYLES } from "@/constants/global-styles";
import { usePersonsByCurrentGroup } from "@/hooks/usePerson";
import { StyleSheet, View } from "react-native";

export default function Persons() {
  const {
    data: persons,
    isLoading,
    isPending,
    isRefetching,
    refetch,
  } = usePersonsByCurrentGroup();

  return (
    <View style={styles.screen}>
      <Header title="Persons" />
      <PersonItems
        persons={persons ?? []}
        refetch={refetch}
        loading={isLoading}
        pending={isPending}
        refreshing={isRefetching}
      />
      <AddPerson />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GLOBAL_STYLES.colors.backgroundColor,
  },
});
