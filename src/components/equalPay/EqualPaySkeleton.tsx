import { GLOBAL_STYLES } from "@/constants/global-styles";
import { ScrollView, StyleSheet, View } from "react-native";
import Header from "../Header";

export default function EqualPaySkeleton() {
  return (
    <View style={styles.screen}>
      <Header title="Equal Pay" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionTitle} />
        <View style={styles.summaryCard}>
          {Array.from({ length: 3 }).map((_, index) => (
            <View key={`summary-row-${index}`}>
              <View style={styles.summaryRow}>
                <View style={[styles.skeletonBlock, styles.summaryLabel]} />
                <View style={[styles.skeletonBlock, styles.summaryValue]} />
              </View>
              {index < 2 && <View style={styles.dividerThin} />}
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <View style={[styles.skeletonBlock, styles.totalLabel]} />
            <View style={[styles.skeletonBlock, styles.totalValue]} />
          </View>
        </View>

        <View style={styles.sectionTitle} />
        {Array.from({ length: 2 }).map((_, index) => (
          <View key={`settlement-card-${index}`} style={styles.settlementCard}>
            <View style={styles.banner}>
              <View style={[styles.skeletonBlock, styles.personChip]} />
              <View style={[styles.skeletonBlock, styles.arrow]} />
              <View style={[styles.skeletonBlock, styles.personChip]} />
            </View>
            <View style={styles.summaryRow}>
              <View style={[styles.skeletonBlock, styles.settlementLabel]} />
              <View style={[styles.skeletonBlock, styles.settlementValue]} />
            </View>
          </View>
        ))}
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
  sectionTitle: {
    width: 96,
    height: 16,
    marginTop: 6,
    marginBottom: 4,
    borderRadius: 8,
    backgroundColor: GLOBAL_STYLES.colors.neutralBackground,
  },
  summaryCard: {
    backgroundColor: GLOBAL_STYLES.colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: GLOBAL_STYLES.colors.borderColor,
    marginBottom: 8,
  },
  settlementCard: {
    backgroundColor: GLOBAL_STYLES.colors.backgroundColor,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: GLOBAL_STYLES.colors.borderColor,
    gap: 12,
  },
  banner: {
    backgroundColor: GLOBAL_STYLES.colors.neutralBackground,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  dividerThin: {
    borderTopWidth: 1,
    borderTopColor: GLOBAL_STYLES.colors.divider,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: GLOBAL_STYLES.colors.borderColor,
    marginVertical: 8,
  },
  skeletonBlock: {
    borderRadius: 999,
    backgroundColor: GLOBAL_STYLES.colors.surfaceMuted,
  },
  summaryLabel: {
    width: 140,
    height: 14,
  },
  summaryValue: {
    width: 90,
    height: 14,
  },
  totalLabel: {
    width: 64,
    height: 18,
  },
  totalValue: {
    width: 110,
    height: 20,
  },
  personChip: {
    width: 88,
    height: 28,
  },
  arrow: {
    width: 24,
    height: 12,
  },
  settlementLabel: {
    width: 118,
    height: 13,
  },
  settlementValue: {
    width: 94,
    height: 20,
  },
});
