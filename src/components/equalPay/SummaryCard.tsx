import { GLOBAL_STYLES } from "@/constants/global-styles";
import { ExpenseSummary } from "@/models/expenseSummary";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  expenseSummary: ExpenseSummary;
}

export default function SummaryCard({ expenseSummary }: Props) {
  return (
    <>
      {/* Title */}
      <Text style={styles.sectionTitle}>Summary</Text>
      <View style={styles.summaryCard}>
        {expenseSummary.personSummaries.map((payment, index) => (
          <View key={payment.name}>
            <View style={styles.summaryRow}>
              {/* Person Name */}
              <Text style={styles.summaryLabel}>{payment.name} pay</Text>
              {/* Amount */}
              <Text style={styles.summaryAmount}>
                {payment.totalPaid.toLocaleString()} THB
              </Text>
            </View>
            {/* Divider */}
            {index < expenseSummary.personSummaries.length - 1 && (
              <View style={styles.summaryDividerThin} />
            )}
          </View>
        ))}

        <View style={styles.summaryDivider} />

        <View style={styles.summaryRow}>
          <Text style={styles.summaryTotalLabel}>Total</Text>
          {/* Total Amount */}
          <Text style={styles.summaryTotalAmount}>
            {expenseSummary.totalExpense.toLocaleString()} THB
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: GLOBAL_STYLES.colors.textPrimary,
    marginTop: 6,
    marginBottom: 4,
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: GLOBAL_STYLES.colors.borderColor,
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
    color: GLOBAL_STYLES.colors.textPrimary,
    fontWeight: "400",
  },
  summaryAmount: {
    fontSize: 15,
    color: GLOBAL_STYLES.colors.textPrimary,
    fontWeight: "600",
  },
  summaryDividerThin: {
    height: 1,
    backgroundColor: GLOBAL_STYLES.colors.borderColor,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: GLOBAL_STYLES.colors.borderColor,
    marginVertical: 12,
  },
  summaryTotalLabel: {
    fontSize: 15,
    color: GLOBAL_STYLES.colors.textPrimary,
    fontWeight: "600",
  },
  summaryTotalAmount: {
    fontSize: 16,
    color: GLOBAL_STYLES.colors.primary,
    fontWeight: "800",
  },
});
