import EqualPayEmptyState from "@/components/equalPay/EqualPayEmplyState";
import Settlements from "@/components/equalPay/Settlements";
import SummaryCard from "@/components/equalPay/SummaryCard";
import Header from "@/components/Header";
import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useNonExcludedExpenses } from "@/hooks/useExpenses";
import { usePersons } from "@/hooks/usePersons";
import { calculateSettlements, calculateSummary } from "@/utils/equalPayUtils";
import { ScrollView, StyleSheet, View } from "react-native";

export default function EqualPayScreen() {
  const { data: persons } = usePersons();
  const { data: nonExcludedExpenses } = useNonExcludedExpenses();

  const expenseSummary = calculateSummary(persons ?? [], nonExcludedExpenses);
  const settlements = calculateSettlements(expenseSummary);

  if (expenseSummary.totalExpense === 0) {
    return (
      <View style={styles.screen}>
        <Header title="Equal Pay" />
        <EqualPayEmptyState />
      </View>
    );
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
