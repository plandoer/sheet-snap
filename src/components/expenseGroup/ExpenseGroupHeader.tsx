import { GLOBAL_STYLES } from "@/constants/global-styles";
import { StyleSheet, Text, View } from "react-native";
import IconButton from "../IconButton";

interface Props {
  onClose: () => void;
}

export default function ExpenseGroupHeader({ onClose }: Props) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Expense Groups</Text>
      <IconButton name="close" color="black" onPress={onClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: GLOBAL_STYLES.colors.textDark,
  },
});
