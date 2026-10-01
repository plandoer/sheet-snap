import AddExpense from "@/components/expenses/AddExpense";
import ExpenseHeader from "@/components/expenses/ExpenseHeader";
import ExpenseItems from "@/components/expenses/ExpenseItems";
import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useGroupContext } from "@/context/GroupContext";
import { useExpensesByGroupId } from "@/hooks/useExpense";
import { StyleSheet, View } from "react-native";

export default function ExpenseScreen() {
  const { currentGroup } = useGroupContext();
  const {
    data: expenses,
    refetch,
    isFetching,
  } = useExpensesByGroupId(currentGroup?.id ?? "");

  const expenseCount = expenses?.length ?? 0;

  return (
    <View style={styles.container}>
      <ExpenseHeader expenseCount={expenseCount} />
      <ExpenseItems
        expenses={expenses ?? []}
        onRefresh={refetch}
        refreshing={isFetching || currentGroup === null}
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
