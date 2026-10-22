import ExpenseForm from "@/components/expenseForm/ExpenseForm";
import ExpenseFormHeader from "@/components/expenseForm/ExpenseFormHeader";
import { useSaveToGoogleSheet } from "@/hooks/useGoogleSheet";
import { Expense } from "@/models/expense";
import { getErrorInfo } from "@/utils/errorUtils";
import { Alert } from "react-native";

export default function QuickAddScreen() {
  const { isSubmitting, save } = useSaveToGoogleSheet();

  async function handleSubmit(expense: Expense) {
    try {
      await save(expense);
      Alert.alert("Success", "Data saved to Google Sheet successfully!");
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message);
    }
  }

  return (
    <>
      {/* Header */}
      <ExpenseFormHeader />
      <ExpenseForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
    </>
  );
}
