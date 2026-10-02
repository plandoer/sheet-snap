import { GLOBAL_STYLES } from "@/constants/global-styles";
import type { Category } from "@/models/category";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import CategoryItem from "./CategoryItem";

interface Props {
  categories: Category[];
  refetch: () => void;
  loading: boolean;
  pending: boolean;
  refreshing: boolean;
}

export default function CategoryItems({
  categories,
  refetch,
  loading,
  pending,
  refreshing,
}: Props) {
  let content = null;

  if (categories.length === 0 && loading) {
    content = (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={GLOBAL_STYLES.colors.primary} />
      </View>
    );
  } else if (categories.length === 0 && !pending) {
    content = (
      <ScrollView
        contentContainerStyle={styles.emptyContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refetch} />
        }
      >
        <Text style={styles.noCategoriesText}>No categories yet.</Text>
      </ScrollView>
    );
  } else {
    content = (
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CategoryItem category={item} />}
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
  noCategoriesText: {
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
