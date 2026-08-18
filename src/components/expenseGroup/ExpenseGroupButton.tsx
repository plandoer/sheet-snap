import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import ExpenseGroupDetailModal from "./ExpenseGroupDetailModal";
import ExpenseGroupsModal from "./ExpenseGroupsModal";

export default function ExpenseGroupButton() {
  const [showExpenseGroupModal, setShowExpenseGroupModal] = useState(false);
  const [showExpenseGroupDetailModal, setShowExpenseGroupDetailModal] =
    useState(false);

  function handleAddExpenseGroup() {
    // Close the Expense Groups Modal
    setShowExpenseGroupModal(false);

    // Open the Expense Group Detail Modal
    setShowExpenseGroupDetailModal(true);
  }

  return (
    <>
      {/* Current Expense Group Button */}
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

      {/* Expense Groups Modal */}
      <ExpenseGroupsModal
        visible={showExpenseGroupModal}
        onClose={() => setShowExpenseGroupModal(false)}
        onAdd={handleAddExpenseGroup}
      />

      {/* Expense Group Detail Modal */}
      <ExpenseGroupDetailModal
        visible={showExpenseGroupDetailModal}
        onClose={() => setShowExpenseGroupDetailModal(false)}
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
    fontSize: 18,
  },
});
