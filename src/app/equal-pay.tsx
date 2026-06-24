import Header from "@/components/Header";
import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const { colors } = GLOBAL_STYLES;

type SettlementPrototype = {
  id: string;
  from: string;
  to: string;
  amount: number;
  currency: string;
  expenses: {
    category: string;
    amount: number;
  }[];
};

const settlementMockData: SettlementPrototype[] = [
  {
    id: "pont-ye",
    from: "Pont",
    to: "Ye",
    amount: 25,
    currency: "THB",
    expenses: [
      { category: "Dinner", amount: 10 },
      { category: "Taxi", amount: 10 },
      { category: "Food", amount: 5 },
    ],
  },
  {
    id: "lily-ye",
    from: "Lily",
    to: "Ye",
    amount: 25,
    currency: "THB",
    expenses: [
      { category: "Dinner", amount: 10 },
      { category: "Taxi", amount: 10 },
      { category: "Food", amount: 5 },
    ],
  },
];

export default function EqualPayScreen() {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const totalExpense = settlementMockData.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  return (
    <View style={styles.screen}>
      <Header title="Equal Pay" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.summaryCard}>
          {settlementMockData.map((item, index) => (
            <View key={item.id}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{item.from} pay</Text>
                <Text style={styles.summaryAmount}>
                  {item.amount.toLocaleString()} {item.currency}
                </Text>
              </View>
              {index < settlementMockData.length - 1 && (
                <View style={styles.summaryDividerThin} />
              )}
            </View>
          ))}

          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalAmount}>
              {totalExpense.toLocaleString()} THB
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Settlement</Text>

        {settlementMockData.map((item) => {
          const isExpanded = expandedIds.includes(item.id);
          const detailTotal = item.expenses.reduce(
            (sum, expense) => sum + expense.amount,
            0,
          );

          return (
            <View key={item.id} style={styles.settlementCard}>
              <View style={styles.payHighlightBanner}>
                <View style={styles.personChip}>
                  <Text style={styles.personChipText}>{item.from}</Text>
                </View>
                <Ionicons name="arrow-forward" size={18} color="#ffffff" />
                <View style={[styles.personChip, styles.personChipReceiver]}>
                  <Text
                    style={[
                      styles.personChipText,
                      styles.personChipTextReceiver,
                    ]}
                  >
                    {item.to}
                  </Text>
                </View>
              </View>

              <View style={styles.payHighlightSummaryRow}>
                <Text style={styles.payHighlightLabel}>Amount to settle</Text>
                <Text style={styles.payHighlightAmount}>
                  {item.amount.toLocaleString()} {item.currency}
                </Text>
              </View>

              <Pressable
                onPress={() => toggleExpanded(item.id)}
                style={styles.detailToggle}
              >
                <Text style={styles.detailToggleText}>Detail</Text>
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={colors.textSecondary}
                />
              </Pressable>

              <View style={styles.divider} />

              {isExpanded && (
                <View style={styles.detailContent}>
                  {item.expenses.map((expense) => (
                    <View
                      key={`${item.id}-${expense.category}`}
                      style={styles.detailExpenseRow}
                    >
                      <View style={styles.detailExpenseLeft}>
                        <View style={styles.detailExpenseDot} />
                        <Text style={styles.detailExpenseCategory}>
                          {expense.category}
                        </Text>
                      </View>
                      <Text style={styles.detailExpenseAmount}>
                        {expense.amount.toLocaleString()} {item.currency}
                      </Text>
                    </View>
                  ))}

                  <View style={styles.detailTotalRow}>
                    <Text style={styles.detailTotalLabel}>Total</Text>
                    <Text style={styles.detailTotalAmount}>
                      {detailTotal.toLocaleString()} {item.currency}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          );
        })}
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: 6,
    marginBottom: 4,
  },

  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderColor,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
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
    fontWeight: "600",
  },
  summaryDividerThin: {
    height: 1,
    backgroundColor: colors.borderColor,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.borderColor,
    marginVertical: 12,
  },
  summaryTotalLabel: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  summaryTotalAmount: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "800",
  },

  settlementCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderColor,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  payHighlightBanner: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  personChip: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  personChipReceiver: {
    backgroundColor: "#ffffff",
  },
  personChipText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
  personChipTextReceiver: {
    color: colors.primary,
  },
  payHighlightSummaryRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  payHighlightLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  payHighlightAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
  },
  detailToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    marginTop: 8,
  },
  detailToggleText: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderColor,
    marginTop: 2,
    marginBottom: 4,
  },
  detailContent: {
    paddingTop: 10,
    gap: 8,
  },
  detailExpenseRow: {
    backgroundColor: "#f8f9fc",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderColor,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailExpenseLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  detailExpenseDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  detailExpenseCategory: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  detailExpenseAmount: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  detailTotalRow: {
    marginTop: 4,
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.borderColor,
  },
  detailTotalLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  detailTotalAmount: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
  },
});
