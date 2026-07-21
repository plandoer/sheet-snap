import { GLOBAL_STYLES } from "@/constants/global-styles";
import type { Person } from "@/models/person";
import { FlatList, StyleSheet, Text, View } from "react-native";
import PersonItem from "./PersonItem";

interface Props {
  persons: Person[];
  onRefresh: () => void;
  refreshing: boolean;
}

export default function PersonItems({ persons, onRefresh, refreshing }: Props) {
  let content = null;

  if (persons.length === 0 && !refreshing) {
    content = (
      <View style={styles.emptyContainer}>
        <Text style={styles.noPersonsText}>No persons yet.</Text>
      </View>
    );
  } else {
    content = (
      <FlatList
        data={persons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PersonItem person={item} />}
        contentContainerStyle={styles.list}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    );
  }

  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  noPersonsText: {
    color: GLOBAL_STYLES.colors.disableText,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
