import { GLOBAL_STYLES } from "@/constants/global-styles";
import { StyleSheet, Text, View } from "react-native";
import Header from "../Header";

export default function EqualPayNoDataState() {
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
            Add an expense, or uncheck Exclude from calculation to include one
            in Equal Pay.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GLOBAL_STYLES.colors.backgroundColor,
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
