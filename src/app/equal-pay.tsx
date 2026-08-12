import Settlements from "@/components/equalPay/Settlements";
import SummaryCard from "@/components/equalPay/SummaryCard";
import Header from "@/components/Header";
import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useExpenses } from "@/hooks/useExpenses";
import { usePersons } from "@/hooks/usePersons";
import { calculateSettlements, calculateSummary } from "@/utils/equalPayUtils";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function EqualPayScreen() {
  const { data: persons } = usePersons();
  const { data: expenses } = useExpenses();
  const expenseSummary = calculateSummary(persons ?? [], expenses);
  const settlements = calculateSettlements(expenseSummary);

  if (expenseSummary.totalExpense === 0) {
    return (
      <View style={styles.screen}>
        <Header title="Equal Pay" />
        <View style={styles.emptyStateWrapper}>
          <View style={styles.emptyStateCard}>
            <View style={styles.emptyStateBadge}>
              <Text style={styles.emptyStateBadgeText}>Equal Pay</Text>
            </View>
            <Text style={styles.emptyStateTitle}>Nothing to calculate yet</Text>
            <Text style={styles.emptyStateDescription}>
              Add some expenses first, then come back to see the equal pay
              summary and suggested settlements.
            </Text>
          </View>
        </View>
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
  emptyStateWrapper: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  emptyStateCard: {
    backgroundColor: GLOBAL_STYLES.colors.surfaceMuted,
    borderColor: GLOBAL_STYLES.colors.borderColor,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: "center",
    gap: 12,
  },
  emptyStateBadge: {
    backgroundColor: GLOBAL_STYLES.colors.overlayLight,
    borderColor: GLOBAL_STYLES.colors.primary,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  emptyStateBadgeText: {
    color: GLOBAL_STYLES.colors.primary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  emptyStateTitle: {
    color: GLOBAL_STYLES.colors.textPrimary,
    fontSize: 21,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyStateDescription: {
    color: GLOBAL_STYLES.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
});
