import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Expense } from "@/models/expense";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ExpenseItem from "./ExpenseItem";

interface Props {
  expenses: Expense[];
  onRefresh: () => void;
  loading: boolean;
  pending: boolean;
  refreshing: boolean;
}

export default function ExpenseItems({
  expenses,
  onRefresh,
  loading,
  pending,
  refreshing,
}: Props) {
  let content = null;

  if (expenses.length === 0 && loading) {
    content = (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={GLOBAL_STYLES.colors.primary} />
      </View>
    );
  } else if (expenses.length === 0 && !pending) {
    content = (
      <ScrollView
        contentContainerStyle={styles.emptyContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.noExpensesText}>No expenses yet.</Text>
      </ScrollView>
    );
  } else {
    content = (
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ExpenseItem expense={item} />}
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
  noExpensesText: {
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
