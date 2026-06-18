import Header from "@/components/Header";
import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { colors } = GLOBAL_STYLES;

// Mock data - replace with real data when implementing business logic
const mockData = {
  totalExpense: 150,
  currency: "THB",
  eachShare: 75,
  payments: [
    { name: "Ye", amount: 100 },
    { name: "Pont", amount: 50 },
  ],
  settlements: [{ from: "Pont", to: "Ye", amount: 25 }],
  personExpenses: [
    {
      name: "Pont",
      expenses: [
        { category: "Dinner", amount: 10 },
        { category: "Taxi", amount: 10 },
        { category: "Food", amount: 5 },
      ],
    },
  ],
};

export default function EqualPayScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <Header title="Equal Pay" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Summary</Text>
          {mockData.payments.map((p, i) => (
            <View key={p.name}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{p.name} pay</Text>
                <Text style={styles.summaryAmount}>
                  {mockData.currency} {p.amount.toLocaleString()}
                </Text>
              </View>
              {i < mockData.payments.length - 1 && (
                <View style={styles.thinDivider} />
              )}
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalRowLabel}>Total</Text>
            <Text style={styles.totalRowAmount}>
              {mockData.currency} {mockData.totalExpense.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Settlement Card */}
        <View style={styles.settlementCard}>
          <Text style={styles.settlementSectionTitle}>Settlement</Text>
          {mockData.settlements.map((s, i) => (
            <View key={i} style={styles.settlementItem}>
              <View style={styles.settlementParties}>
                <View style={styles.settlementPersonBadge}>
                  <Text style={styles.settlementPersonText}>{s.from[0]}</Text>
                </View>
                <Text style={styles.settlementFrom}>{s.from}</Text>
                <View style={styles.arrowContainer}>
                  <View style={styles.arrowLine} />
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color="rgba(255,255,255,0.9)"
                  />
                </View>
                <Text style={styles.settlementTo}>{s.to}</Text>
                <View
                  style={[
                    styles.settlementPersonBadge,
                    styles.settlementPersonBadgeTo,
                  ]}
                >
                  <Text
                    style={[
                      styles.settlementPersonText,
                      styles.settlementPersonTextTo,
                    ]}
                  >
                    {s.to[0]}
                  </Text>
                </View>
              </View>
              <View style={styles.settlementAmountBlock}>
                <Text style={styles.settlementAmountLabel}>Owes</Text>
                <Text style={styles.settlementAmountLarge}>
                  {mockData.currency} {s.amount.toLocaleString()}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Per-person Expense Cards */}
        {mockData.personExpenses.map((person) => (
          <View key={person.name} style={styles.card}>
            <Text style={styles.sectionTitle}>
              Detail Expenses for {person.name}
            </Text>
            {person.expenses.map((exp, i) => (
              <View
                key={i}
                style={[
                  styles.expenseRow,
                  i < person.expenses.length - 1 && styles.expenseRowBorder,
                ]}
              >
                <View style={styles.categoryDot} />
                <Text style={styles.expenseCategory}>{exp.category}</Text>
                <Text style={styles.expenseAmount}>
                  {mockData.currency} {exp.amount.toLocaleString()}
                </Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.subtotalRow}>
              <Text style={styles.subtotalLabel}>Total</Text>
              <Text style={styles.subtotalAmount}>
                {mockData.currency}{" "}
                {person.expenses
                  .reduce((sum, e) => sum + e.amount, 0)
                  .toLocaleString()}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
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

  // Card
  card: {
    backgroundColor: "#f8f9fb",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },

  // Summary rows
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  summaryLabel: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: "400",
  },
  summaryAmount: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  thinDivider: {
    height: 1,
    backgroundColor: colors.borderColor,
  },
  totalRowLabel: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  totalRowAmount: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: "700",
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.borderColor,
    marginVertical: 14,
  },

  // Section title
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 14,
  },

  // Settlement
  settlementCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
  },
  settlementSectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ffffff99",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  settlementItem: {
    gap: 16,
  },
  settlementParties: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settlementPersonBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  settlementPersonBadgeTo: {
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  settlementPersonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  settlementPersonTextTo: {
    color: colors.primary,
  },
  settlementFrom: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  arrowContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  arrowLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  settlementTo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  settlementAmountBlock: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  settlementAmountLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255,255,255,0.7)",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  settlementAmountLarge: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
  },

  // Per-person expenses
  expenseRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 10,
  },
  expenseRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  expenseCategory: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  expenseAmount: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  subtotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subtotalLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  subtotalAmount: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
  },
});
