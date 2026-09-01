import EqualPayNoDataState from "@/components/equalPay/EqualPayNoDataState";
import EqualPaySkeleton from "@/components/equalPay/EqualPaySkeleton";
import Settlements from "@/components/equalPay/Settlements";
import SummaryCard from "@/components/equalPay/SummaryCard";
import Header from "@/components/Header";
import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useExpenseGroupContext } from "@/context/ExpenseGroupContext";
import { useNonExcludedExpenses } from "@/hooks/useExpense";
import { usePersons } from "@/hooks/usePerson";
import { calculateSettlements, calculateSummary } from "@/utils/equalPayUtils";
import { ScrollView, StyleSheet, View } from "react-native";

export default function EqualPayScreen() {
  const { data: persons, isPending: isPersonsPending } = usePersons();
  const { currentGroup } = useExpenseGroupContext();
  const { data: nonExcludedExpenses, isPending } = useNonExcludedExpenses(
    currentGroup?.id ?? "",
  );

  if (isPersonsPending || isPending) {
    return <EqualPaySkeleton />;
  }

  const expenseSummary = calculateSummary(persons ?? [], nonExcludedExpenses);
  const settlements = calculateSettlements(expenseSummary);

  if (expenseSummary.totalExpense === 0) {
    return <EqualPayNoDataState />;
  }

  return (
    <View style={styles.screen}>
      <Header title="Equal Pay" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Section */}
        <SummaryCard expenseSummary={expenseSummary} />

        {/* Settlement Section */}
        <Settlements settlements={settlements} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GLOBAL_STYLES.colors.backgroundColor,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  content: {
    paddingBottom: 32,
    gap: 12,
  },
});
