import ExpenseForm from "@/components/expenseForm/ExpenseForm";
import ExpenseDetailsHeader from "@/components/expenses/ExpenseDetailsHeader";
import Header from "@/components/Header";
import LoadingOverlay from "@/components/LoadingOverlay";
import { GLOBAL_STYLES } from "@/constants/global-styles";
import {
  useCreateExpense,
  useDeleteExpense,
  useExpenseById,
  useUpdateExpense,
} from "@/hooks/useExpense";
import { ErrorType } from "@/models/enums/errorType";
import { Expense } from "@/models/expense";
import { getErrorInfo } from "@/utils/errorUtils";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function ExpenseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data: expense, isLoading } = useExpenseById(id);

  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: createExpenseAsync } = useCreateExpense();
  const { mutateAsync: updateExpenseAsync } = useUpdateExpense();
  const { mutateAsync: deleteExpenseAsync, isPending: isDeleting } =
    useDeleteExpense();

  async function handleSubmit(expense: Expense) {
    setIsSubmitting(true);
    try {
      if (id) {
        await updateExpenseAsync({ id, expense });
      } else {
        await createExpenseAsync(expense);
      }
      navigation.goBack();
    } catch (error) {
      console.error("Error saving expense:", error);
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      if (!id) {
        const error = new Error(`Can't delete expense! Expense id is: ${id}`);
        error.name = ErrorType.FAILED_TO_DELETE_EXPENSE;
        throw error;
      }
      await deleteExpenseAsync(id);
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting expense:", error);
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title={id ? "Edit Expense" : "Add Expense"} />
        <View style={styles.content}>
          <View style={styles.loadingContainer}>
            <Text>Please wait...</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ExpenseDetailsHeader id={id} onDelete={handleDelete} />
      <ExpenseForm
        expense={expense}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
      <LoadingOverlay visible={isDeleting} message="Deleting, please wait..." />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GLOBAL_STYLES.colors.backgroundColor,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
