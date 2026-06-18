import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import IconButton from "../ui/IconButton";

export default function ExpenseHeader() {
  const router = useRouter();

  function goToEqualPay() {
    router.push("/equal-pay");
  }

  return (
    <View style={styles.container}>
      {/* Share to Expense Group */}
      <IconButton name="share-outline" onPress={() => {}} />

      <View style={styles.rightActions}>
        {/* Upload to Google Sheet */}
        <IconButton name="cloud-upload-outline" onPress={() => {}} />

        {/* Calculate Expenses */}
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
    borderBottomColor: "#E0E0E0",
  },
  rightActions: {
    flexDirection: "row",
    gap: 4,
  },
});
