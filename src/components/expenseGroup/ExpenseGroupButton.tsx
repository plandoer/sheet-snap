import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import ExpenseGroupsModal from "./ExpenseGroupsModal";

export default function ExpenseGroupButton() {
  const [showExpenseGroupModal, setShowExpenseGroupModal] = useState(false);

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.container}
        onPress={() => setShowExpenseGroupModal(true)}
      >
        <Text style={styles.label}>Personal</Text>
        <Ionicons
          name="chevron-down"
          size={28}
          color={GLOBAL_STYLES.colors.textMedium}
        />
      </TouchableOpacity>
      <ExpenseGroupsModal
        visible={showExpenseGroupModal}
        onClose={() => setShowExpenseGroupModal(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  label: {
    color: GLOBAL_STYLES.colors.textStrong,
    fontSize: 20,
  },
});
