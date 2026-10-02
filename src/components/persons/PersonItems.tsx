import { GLOBAL_STYLES } from "@/constants/global-styles";
import type { Person } from "@/models/person";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import PersonItem from "./PersonItem";

interface Props {
  persons: Person[];
  refetch: () => void;
  loading: boolean;
  pending: boolean;
  refreshing: boolean;
}

export default function PersonItems({
  persons,
  refetch,
  loading,
  pending,
  refreshing,
}: Props) {
  let content = null;

  if (persons.length === 0 && loading) {
    content = (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={GLOBAL_STYLES.colors.primary} />
      </View>
    );
  } else if (persons.length === 0 && !pending) {
    content = (
      <ScrollView
        contentContainerStyle={styles.emptyContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refetch} />
        }
      >
        <Text style={styles.noPersonsText}>No persons yet.</Text>
      </ScrollView>
    );
  } else {
    content = (
      <FlatList
        data={persons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PersonItem person={item} />}
        contentContainerStyle={styles.list}
        onRefresh={refetch}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
