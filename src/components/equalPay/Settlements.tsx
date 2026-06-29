import { GLOBAL_STYLES } from "@/constants/global-styles";
import { ExpenseSummary } from "@/models/expenseSummary";
import { calculateEqualPay } from "@/utils/equalPayUtils";
import { StyleSheet, Text } from "react-native";
import SettlementCard from "./SettlementCard";

interface Props {
  expenseSummary: ExpenseSummary;
}

export default function Settlements({ expenseSummary }: Props) {
  const equalPay = calculateEqualPay(expenseSummary);

  return (
    <>
      {/* Title */}
      <Text style={styles.sectionTitle}>Settlement</Text>

      {/* Settlement Cards */}
      {equalPay.settlements.map((settlement) => (
        <SettlementCard key={settlement.id} settlement={settlement} />
      ))}
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
});
