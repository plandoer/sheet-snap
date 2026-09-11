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
  const [showExpenseGroupsModal, setShowExpenseGroupsModal] = useState(false);
  const [showExpenseGroupEditModal, setShowExpenseGroupEditModal] =
    useState(false);

  function handleEditExpenseGroup(expenseGroup: ExpenseGroup) {
    setSelectedExpenseGroup(expenseGroup);
    setShowExpenseGroupsModal(false);
    setShowExpenseGroupEditModal(true);
  }

  return (
    <>
      {/* Current Expense Group Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.container}
        onPress={() => setShowExpenseGroupsModal(true)}
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
        visible={showExpenseGroupsModal}
        onClose={() => setShowExpenseGroupsModal(false)}
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
