import ExpenseForm from "@/components/expenseForm/ExpenseForm";
import ExpenseFormHeader from "@/components/expenseForm/ExpenseFormHeader";
import { useGroupContext } from "@/context/GroupContext";
import { Expense } from "@/models/expense";
import { getErrorInfo } from "@/utils/errorUtils";
import { handleAppendToSheet } from "@/utils/formUtils";
import { useState } from "react";
import { Alert } from "react-native";

export default function QuickAddScreen() {
  const { currentGroup } = useGroupContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);

  async function handleSubmit(expense: Expense) {
    try {
      setIsSubmitting(true);

      await handleAppendToSheet(
        [expense],
        currentGroup?.spreadsheetSheetSelection,
      );
      resetForm();

      Alert.alert("Success", "Data saved to Google Sheet successfully!");
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setFormKey((key) => key + 1);
  }

  return (
    <>
      <ExpenseFormHeader />
      <ExpenseForm
        key={formKey}
        showSheetPicker={true}
        showExcludeToggle={false}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </>
  );
}
