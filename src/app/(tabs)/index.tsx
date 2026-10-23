import ExpenseForm from "@/components/expenseForm/ExpenseForm";
import ExpenseFormHeader from "@/components/expenseForm/ExpenseFormHeader";
import { useSheetContext } from "@/context/SheetContext";
import { Expense } from "@/models/expense";
import { getErrorInfo } from "@/utils/errorUtils";
import { handleAppendToSheet } from "@/utils/formUtils";
import { useState } from "react";
import { Alert } from "react-native";

export default function QuickAddScreen() {
  const { selectedSheet } = useSheetContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(expense: Expense) {
    try {
      setIsSubmitting(true);

      await handleAppendToSheet(expense, selectedSheet);

      Alert.alert("Success", "Data saved to Google Sheet successfully!");
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* Header */}
      <ExpenseFormHeader />
      <ExpenseForm
        showSheetPicker={true}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </>
  );
}
