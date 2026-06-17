import AmountInputs from "@/components/expenses/AmountInputs";
import ExpenseDetailsHeader from "@/components/expenses/ExpenseDetailsHeader";
import Header from "@/components/Header";
import LoadingOverlay from "@/components/LoadingOverlay";
import CategoryPicker from "@/components/sheetForm/CategoryPicker";
import DatePicker from "@/components/sheetForm/DatePicker";
import { FormInput } from "@/components/sheetForm/FormInput";
import PersonSelector from "@/components/sheetForm/PersonSelector";
import Toggler from "@/components/Toggler";
import { GLOBAL_STYLES } from "@/constants/global-styles";
import { persons } from "@/data/personData";
import {
  useCreateExpense,
  useDeleteExpense,
  useExpenseById,
  useUpdateExpense,
} from "@/hooks/useExpenses";
import { ErrorType } from "@/models/enums/errorType";
import { Expense } from "@/models/expense";
import { getErrorInfo } from "@/utils/errorUtils";
import { validateExpenseForm } from "@/utils/validationUtils";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ExpenseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const navigation = useNavigation();
  const { data, isLoading } = useExpenseById(id);
  const [expense, setExpense] = useState<Expense>(new Expense());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [disableExclude, setDisableExclude] = useState(false);
  const { mutateAsync: createExpenseAsync } = useCreateExpense();
  const { mutateAsync: updateExpenseAsync } = useUpdateExpense();
  const { mutateAsync: deleteExpenseAsync, isPending: isDeleting } =
    useDeleteExpense();
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>(
    {},
  );

  function handleValue(value: any, field: keyof Expense) {
    setErrorMessages((prev) => ({ ...prev, [field]: "" }));
    setExpense((prev) => ({ ...prev, [field]: value }));
  }

  function handleDateChange(date?: Date) {
    if (!date) return;
    handleValue(date, "date");
  }

  function handleSplitInHalfChange(splitInHalf: boolean) {
    handleValue(splitInHalf, "splitInHalf");
    if (splitInHalf) {
      handleValue(true, "excluded");
      setDisableExclude(true);
    } else {
      setDisableExclude(false);
    }
  }

  async function handleSubmit() {
    console.log("Submitting expense:", expense);

    const errors = validateExpenseForm(expense);
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }

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

  useEffect(() => {
    if (!data) return;
    setExpense(data);

    if (data.splitInHalf) {
      setDisableExclude(true);
    } else {
      setDisableExclude(false);
    }
  }, [data]);

  if (isLoading) {
    return (
      <View style={styles.keyboardAvoidingView}>
        <View style={styles.content}>
          <Header title={id ? "Edit Expense" : "Add Expense"} />
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>Please wait...</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <ExpenseDetailsHeader id={id} onDelete={handleDelete} />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Date Picker */}
          <DatePicker
            errorMessage={errorMessages.date}
            date={expense.date}
            onDateChange={handleDateChange}
          />

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Amount */}
            <AmountInputs
              errorMessage={errorMessages.amount}
              amount={expense.amount}
              subAmounts={expense.subAmounts}
              onAmountChange={(value) => handleValue(value, "amount")}
              onSubAmountsChange={(subAmounts) =>
                handleValue(subAmounts, "subAmounts")
              }
            />

            {/* Reason Field */}
            <FormInput
              errorMessage={errorMessages.reason}
              value={expense.reason}
              setValue={(reason) => handleValue(reason, "reason")}
              label="Reason"
              placeholder="Enter reason"
            />

            {/* Note Field */}
            <FormInput
              value={expense.note}
              setValue={(note) => handleValue(note, "note")}
              label="Note (Optional)"
              placeholder="Enter note"
              keyboardType="default"
              textarea={true}
            />

            {/* Category Field */}
            <CategoryPicker
              errorMessage={errorMessages.category}
              selectedCategory={expense.category}
              onCategoryChange={(category) => handleValue(category, "category")}
            />

            {/* Person Selection */}
            <PersonSelector
              persons={persons}
              errorMessage={errorMessages.paidBy}
              customLabel="Paid By"
              selectedPerson={expense.paidBy}
              onPersonChange={(paidBy) => handleValue(paidBy, "paidBy")}
            />

            {/* Split in Half Toggle */}
            <Toggler
              label="Split in Half"
              value={expense.splitInHalf}
              onValueChange={(splitInHalf) =>
                handleSplitInHalfChange(splitInHalf)
              }
            />

            {/* Exclude from calculation Toggle*/}
            <Toggler
              label="Exclude from calculation"
              value={expense.excluded}
              onValueChange={(excluded) => handleValue(excluded, "excluded")}
              disabled={disableExclude}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.saveButton,
              isSubmitting && styles.saveButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.saveButtonText}>
              {isSubmitting ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      <LoadingOverlay visible={isDeleting} message="Deleting, please wait..." />
    </>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  dateText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },
  formContainer: {
    marginTop: 20,
    marginBottom: 30,
  },

  noteInput: {
    height: 80,
    textAlignVertical: "top",
  },

  saveButton: {
    backgroundColor: GLOBAL_STYLES.colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: "#6c757d",
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
