import AddExpense from "@/components/expenses/AddExpense";
import ExpenseHeader from "@/components/expenses/ExpenseHeader";
import ExpenseItems from "@/components/expenses/ExpenseItems";
import { useExpenses } from "@/hooks/useExpenses";
import { StyleSheet, View } from "react-native";

export default function ExpenseScreen() {
  const { data: expenses, refetch, isFetching } = useExpenses();

  return (
    <View style={styles.container}>
      <ExpenseHeader />
      <ExpenseItems
        expenses={expenses ?? []}
        onRefresh={refetch}
        refreshing={isFetching}
      />
      <AddExpense />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F4F7",
  },
});
