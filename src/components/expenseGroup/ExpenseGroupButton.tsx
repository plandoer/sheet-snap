import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useExpenseGroupContext } from "@/context/ExpenseGroupContext";
import { ExpenseGroup } from "@/models/expenseGroup";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import ExpenseGroupEditModal from "./ExpenseGroupEditModal";
import ExpenseGroupsModal from "./ExpenseGroupsModal";

export default function ExpenseGroupButton() {
  const { currentGroup } = useExpenseGroupContext();

  const [selectedExpenseGroup, setSelectedExpenseGroup] =
    useState<ExpenseGroup | null>(null);
  const [showExpenseGroupModal, setShowExpenseGroupModal] = useState(false);
  const [showExpenseGroupEditModal, setShowExpenseGroupEditModal] =
    useState(false);

  function handleAddExpenseGroup() {
    // Close the Expense Groups Modal
    setShowExpenseGroupModal(false);

    // Open the Expense Group Edit Modal
    setShowExpenseGroupEditModal(true);
  }

  function handleEditExpenseGroup(expenseGroup: ExpenseGroup) {
    // Set the selected expense group
    setSelectedExpenseGroup(expenseGroup);

    // Close the Expense Groups Modal
    setShowExpenseGroupModal(false);

    // Open the Expense Group Edit Modal
    setShowExpenseGroupEditModal(true);
  }

  return (
    <>
      {/* Current Expense Group Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.container}
        onPress={() => setShowExpenseGroupModal(true)}
      >
        <Text style={styles.label}>
          {currentGroup?.name ?? "No Expense Group"}
        </Text>
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
        onEdit={handleEditExpenseGroup}
      />

      {/* Expense Group Edit Modal */}
      {selectedExpenseGroup && (
        <ExpenseGroupEditModal
          expenseGroup={selectedExpenseGroup}
          visible={showExpenseGroupEditModal}
          onClose={() => setShowExpenseGroupEditModal(false)}
        />
      )}
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
