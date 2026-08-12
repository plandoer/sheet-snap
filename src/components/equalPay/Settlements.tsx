import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Settlement } from "@/models/settlement";
import { StyleSheet, Text } from "react-native";
import SettlementCard from "./SettlementCard";

interface Props {
  settlements: Settlement[];
}

export default function Settlements({ settlements }: Props) {
  return (
    <>
      {/* Title */}
      <Text style={styles.sectionTitle}>Settlements</Text>

      {/* Settlement Cards */}
      {settlements.map((settlement) => (
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
