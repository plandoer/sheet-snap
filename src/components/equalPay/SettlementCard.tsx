import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Settlement } from "@/models/settlement";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  settlement: Settlement;
}

export default function SettlementCard({ settlement }: Props) {
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
});
