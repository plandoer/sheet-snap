import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Settlement } from "@/models/settlement";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  settlement: Settlement;
}

export default function SettlementCard({ settlement }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const detailTotal = settlement.expenses.reduce(
    (sum, expense) => sum + +expense.amount,
    0,
  );

  return (
    <View key={settlement.id} style={styles.settlementCard}>
      <View style={styles.payHighlightBanner}>
        <View style={styles.personChip}>
          {/* Payer Name */}
          <Text style={styles.personChipText}>{settlement.from}</Text>
        </View>
        <Ionicons name="arrow-forward" size={18} color="#ffffff" />
        <View style={[styles.personChip, styles.personChipPayee]}>
          {/* Payee Name */}
          <Text style={[styles.personChipText, styles.personChipTextPayee]}>
            {settlement.to}
          </Text>
        </View>
      </View>

      <View style={styles.payHighlightSummaryRow}>
        <Text style={styles.payHighlightLabel}>Amount to settle</Text>
        {/* Settlement Amount */}
        <Text style={styles.payHighlightAmount}>
          {settlement.amount.toLocaleString()} THB
        </Text>
      </View>

      {/* Detail Toggle */}
      <Pressable
        onPress={() => setIsExpanded((prev) => !prev)}
        style={styles.detailToggle}
      >
        <Text style={styles.detailToggleText}>Detail</Text>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={GLOBAL_STYLES.colors.textSecondary}
        />
      </Pressable>

      <View style={styles.divider} />

      {isExpanded && (
        <View style={styles.detailContent}>
          {settlement.expenses.map((expense) => (
            <View
              key={`${settlement.id}-${expense.category}`}
              style={styles.detailExpenseRow}
            >
              <View style={styles.detailExpenseLeft}>
                <View style={styles.detailExpenseDot} />
                {/* Expense Reason */}
                <Text style={styles.detailExpenseCategory}>
                  {expense.reason}
                </Text>
              </View>
              {/* Expense Amount */}
              <Text style={styles.detailExpenseAmount}>
                {(+expense.amount).toLocaleString()} THB
              </Text>
            </View>
          ))}

          <View style={styles.detailTotalRow}>
            <Text style={styles.detailTotalLabel}>Total</Text>
            {/* Total Amount */}
            <Text style={styles.detailTotalAmount}>
              {detailTotal.toLocaleString()} THB
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  settlementCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: GLOBAL_STYLES.colors.borderColor,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  payHighlightBanner: {
    backgroundColor: GLOBAL_STYLES.colors.primary,
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
  personChipPayee: {
    backgroundColor: "#ffffff",
  },
  personChipText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
  personChipTextPayee: {
    color: GLOBAL_STYLES.colors.primary,
  },
  payHighlightSummaryRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  payHighlightLabel: {
    fontSize: 13,
    color: GLOBAL_STYLES.colors.textSecondary,
    fontWeight: "500",
  },
  payHighlightAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: GLOBAL_STYLES.colors.primary,
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
    color: GLOBAL_STYLES.colors.textSecondary,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: GLOBAL_STYLES.colors.borderColor,
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
    borderColor: GLOBAL_STYLES.colors.borderColor,
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
    backgroundColor: GLOBAL_STYLES.colors.primary,
  },
  detailExpenseCategory: {
    fontSize: 14,
    color: GLOBAL_STYLES.colors.textPrimary,
    fontWeight: "500",
  },
  detailExpenseAmount: {
    fontSize: 14,
    color: GLOBAL_STYLES.colors.textPrimary,
    fontWeight: "600",
  },
  detailTotalRow: {
    marginTop: 4,
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: GLOBAL_STYLES.colors.borderColor,
  },
  detailTotalLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: GLOBAL_STYLES.colors.textSecondary,
  },
  detailTotalAmount: {
    fontSize: 16,
    fontWeight: "800",
    color: GLOBAL_STYLES.colors.textPrimary,
  },
});
