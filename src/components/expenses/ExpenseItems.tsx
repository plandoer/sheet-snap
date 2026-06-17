import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Expense } from "@/models/expense";
import { FlatList, StyleSheet, Text, View } from "react-native";
import ExpenseItem from "./ExpenseItem";

interface Props {
  expenses: Expense[];
  onRefresh: () => void;
  refreshing: boolean;
}

export default function ExpenseItems({
  expenses,
  onRefresh,
  refreshing,
}: Props) {
  let content = null;

  if (expenses.length === 0 && !refreshing) {
    content = (
      <View style={styles.emptyContainer}>
        <Text style={styles.noExpensesText}>No expenses yet.</Text>
      </View>
    );
  } else {
    content = (
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ExpenseItem expense={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
