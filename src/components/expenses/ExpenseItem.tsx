import { GLOBAL_STYLES } from "@/constants/global-styles";
import { StyleSheet, Text, View } from "react-native";

export interface Expense {
  id: string;
  name: string;
  amount: number;
  currency: string;
  paidBy: string;
  date: Date;
  excluded: boolean;
}

interface Props {
  expense: Expense;
}

function formatDate(date: Date): string {
  const day = date.getDate();
  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
          ? "rd"
          : "th";
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day}${suffix} ${month}, ${year}`;
}

export default function ExpenseItem({ expense }: Props) {
  return (
    <View style={[styles.card, expense.excluded && styles.cardExcluded]}>
      <View style={styles.accentBar} />
      <View style={styles.content}>
        {/* Top row */}
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {expense.name}
          </Text>
          <Text style={styles.date}>{formatDate(expense.date)}</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Bottom row */}
        <View style={styles.bottomRow}>
          <View style={styles.amountRow}>
            <Text
              style={[styles.amount, expense.excluded && styles.amountExcluded]}
            >
              {expense.amount.toLocaleString()} {expense.currency}
            </Text>
            {expense.excluded && (
              <View style={styles.excludedBadge}>
                <Text style={styles.excludedText}>Excluded</Text>
              </View>
            )}
          </View>
          <View style={styles.paidByRow}>
            <Text style={styles.paidByLabel}>Paid by </Text>
            <Text style={styles.paidByName}>{expense.paidBy}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const PRIMARY = GLOBAL_STYLES.colors.primary;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardExcluded: {
    backgroundColor: "#FAFAFA",
    shadowOpacity: 0.04,
    elevation: 1,
  },
  accentBar: {
    width: 4,
    backgroundColor: PRIMARY,
  },
  content: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111",
    flex: 1,
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    color: "#888",
    fontWeight: "400",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amount: {
    fontSize: 18,
    fontWeight: "700",
    color: PRIMARY,
  },
  amountExcluded: {
    color: "#AAAAAA",
    textDecorationLine: "line-through",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  excludedBadge: {
    backgroundColor: "#FDECEA",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  excludedText: {
    fontSize: 11,
    color: "#D32F2F",
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  paidByRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  paidByLabel: {
    fontSize: 12,
    color: "#888",
  },
  paidByName: {
    fontSize: 12,
    color: "#444",
    fontWeight: "500",
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 9,
    color: "#FFF",
    fontWeight: "700",
  },
});
