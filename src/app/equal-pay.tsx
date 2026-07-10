import Settlements from "@/components/equalPay/Settlements";
import SummaryCard from "@/components/equalPay/SummaryCard";
import Header from "@/components/Header";
import { GLOBAL_STYLES } from "@/constants/global-styles";
import { persons } from "@/data/personData";
import { useExpenses } from "@/hooks/useExpenses";
import { calculateSummary } from "@/utils/equalPayUtils";
import { ScrollView, StyleSheet, View } from "react-native";

const { colors } = GLOBAL_STYLES;

export default function EqualPayScreen() {
  const { data: expenses } = useExpenses();
  const expenseSummary = calculateSummary(persons, expenses);

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
        <Settlements expenseSummary={expenseSummary} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: 16,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
    gap: 12,
  },
});
