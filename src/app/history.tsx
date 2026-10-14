import ExpenseItems from "@/components/expenses/ExpenseItems";
import Header from "@/components/Header";
import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useExpenseHistoryByCurrentGroup } from "@/hooks/useExpense";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function HistoryScreen() {
  const {
    data: expenses,
    refetch,
    isLoading,
    isPending,
    isRefetching,
  } = useExpenseHistoryByCurrentGroup();

  const router = useRouter();

  function goToDetail(expenseId: string) {
    router.push({
      pathname: "/history-details",
      params: { id: expenseId },
    });
  }

  return (
    <View style={styles.container}>
      <Header title="History" />
      <ExpenseItems
        expenses={expenses ?? []}
        onRefresh={refetch}
        loading={isLoading}
        pending={isPending}
        refreshing={isRefetching}
        onClick={goToDetail}
        emptyMessage="No exported expenses yet."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GLOBAL_STYLES.colors.screenBackground,
  },
});
