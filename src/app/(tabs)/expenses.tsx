import AddExpense from "@/components/expenses/AddExpense";
import ExpenseHeader from "@/components/expenses/ExpenseHeader";
import ExpenseItems from "@/components/expenses/ExpenseItems";
import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useExpensesByCurrentGroup } from "@/hooks/useExpense";
import { StyleSheet, View } from "react-native";

export default function ExpenseScreen() {
  const {
    data: expenses,
    refetch,
    isLoading,
    isPending,
    isRefetching,
  } = useExpensesByCurrentGroup();

  return (
    <View style={styles.container}>
      <ExpenseHeader />
      <ExpenseItems
        expenses={expenses ?? []}
        onRefresh={refetch}
        loading={isLoading}
        pending={isPending}
        refreshing={isRefetching}
      />
      <AddExpense />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GLOBAL_STYLES.colors.screenBackground,
  },
});
