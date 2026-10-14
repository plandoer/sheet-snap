import Header from "@/components/Header";
import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useExpenseHistoryByCurrentGroup } from "@/hooks/useExpense";
import { formatDate } from "@/utils/dateUtils";
import { useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export default function HistoryDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data: expenses, isPending } = useExpenseHistoryByCurrentGroup();
  const expense = expenses?.find((e) => e.id === id);

  let content;
  if (isPending) {
    content = (
      <ActivityIndicator
        style={styles.center}
        size="large"
        color={GLOBAL_STYLES.colors.primary}
      />
    );
  } else if (!expense) {
    content = (
      <Text style={[styles.center, styles.empty]}>Expense not found.</Text>
    );
  } else {
    content = (
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.reason}>{expense.reason}</Text>
          <Text style={styles.amount}>
            {Number(expense.amount).toLocaleString()} {expense.currency}
          </Text>
          {expense.excluded && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Excluded</Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Row label="Date" value={formatDate(expense.date)} />
          <Row label="Category" value={expense.category.name} />
          <Row label="Paid by" value={expense.paidBy.name} />
          {expense.splitInHalf && <Row label="Split" value="In half" />}
          {!!expense.note && <Row label="Note" value={expense.note} />}
        </View>

        {expense.subAmounts.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Sub amounts</Text>
            {expense.subAmounts.map((s) => (
              <Row
                key={s.id}
                label={s.reason}
                value={Number(s.amount).toLocaleString()}
              />
            ))}
          </View>
        )}

        {expense.eachShares.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Each share</Text>
            {expense.eachShares.map((s) => (
              <Row
                key={s.id}
                label={s.person.name}
                value={Number(s.amount).toLocaleString()}
              />
            ))}
          </View>
        )}
      </ScrollView>
    );
  }

  return (
    <View style={styles.screen}>
      <Header title="Expense Details" />
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GLOBAL_STYLES.colors.screenBackground,
  },
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  center: {
    marginTop: 48,
    alignSelf: "center",
  },
  empty: {
    color: GLOBAL_STYLES.colors.disableText,
    fontSize: 16,
  },
  card: {
    backgroundColor: GLOBAL_STYLES.colors.white,
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  reason: {
    fontSize: 20,
    fontWeight: "600",
    color: GLOBAL_STYLES.colors.textStrong,
  },
  amount: {
    fontSize: 24,
    fontWeight: "700",
    color: GLOBAL_STYLES.colors.primary,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: GLOBAL_STYLES.colors.dangerBackground,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: GLOBAL_STYLES.colors.dangerText,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: GLOBAL_STYLES.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  label: {
    fontSize: 14,
    color: GLOBAL_STYLES.colors.textSecondary,
  },
  value: {
    flex: 1,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "500",
    color: GLOBAL_STYLES.colors.textPrimary,
  },
});
