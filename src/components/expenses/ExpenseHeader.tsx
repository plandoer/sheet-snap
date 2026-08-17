import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useThrottledCallback } from "@/hooks/useThrottledCallback";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import ExpenseGroupButton from "../expenseGroup/ExpenseGroupButton";
import IconButton from "../IconButton";

export default function ExpenseHeader() {
  const router = useRouter();

  const goToEqualPay = useThrottledCallback(() => {
    router.push("/equal-pay");
  });

  return (
    <View style={styles.container}>
      {/* Expense Group Button */}
      <ExpenseGroupButton />

      <View style={styles.rightActions}>
        {/* Upload to Google Sheet Icon Button */}
        <IconButton name="cloud-upload-outline" onPress={() => {}} />

        {/* Calculate Expenses Icon Button*/}
        <IconButton name="calculator-outline" onPress={goToEqualPay} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: GLOBAL_STYLES.colors.backgroundColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: GLOBAL_STYLES.colors.borderLight,
  },
  rightActions: {
    flexDirection: "row",
    gap: 4,
  },
});
