import AddExpense from "@/components/expenses/AddExpense";
import ExpenseHeader from "@/components/expenses/ExpenseHeader";
import ExpenseItems from "@/components/expenses/ExpenseItems";
import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useCurrentGroupContext } from "@/context/CurrentGroupContext";
import { useExpensesByGroupId } from "@/hooks/useExpense";
import { StyleSheet, View } from "react-native";

export default function ExpenseScreen() {
  const { group } = useCurrentGroupContext();
  const {
    data: expenses,
    refetch,
    isFetching,
  } = useExpensesByGroupId(group?.id ?? "");

  return (
    <View style={styles.container}>
      <ExpenseHeader />
      <ExpenseItems
        expenses={expenses ?? []}
        onRefresh={refetch}
        refreshing={isFetching || group === null}
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
