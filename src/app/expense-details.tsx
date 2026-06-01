import AmountInputs from "@/components/expenses/AmountInputs";
import Header from "@/components/Header";
import CategoryPicker from "@/components/sheetForm/CategoryPicker";
import DatePicker from "@/components/sheetForm/DatePicker";
import { FormInput } from "@/components/sheetForm/FormInput";
import PersonSelector from "@/components/sheetForm/PersonSelector";
import Toggler from "@/components/Toggler";
import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useCreateExpense } from "@/hooks/useExpenses";
import { Expense } from "@/models/expense";
import { Person } from "@/models/person";
import { getErrorInfo } from "@/utils/errorUtils";
import { useNavigation } from "expo-router";
import { useState } from "react";
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

const persons: Person[] = [new Person(1, "Ye"), new Person(2, "Pont")];

export default function ExpenseDetailsScreen() {
  const navigation = useNavigation();
  const [expense, setExpense] = useState<Expense>(new Expense());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [disableExclude, setDisableExclude] = useState(false);
  const { mutateAsync } = useCreateExpense();

  function handleChange<K extends keyof Expense>(field: K, value: Expense[K]) {
    setExpense((prev) => ({ ...prev, [field]: value }));
  }

  function handleDateChange(date?: Date) {
    if (!date) return;
    handleChange("date", date);
  }

  function handleSplitInHalfChange(splitInHalf: boolean) {
    handleChange("splitInHalf", splitInHalf);
    if (splitInHalf) {
      handleChange("excluded", true);
      setDisableExclude(true);
    } else {
      setDisableExclude(false);
    }
  }

  async function handleSubmit() {
    console.log("Submitting expense:", expense);

    if (
      !expense.amount.trim() ||
      !expense.reason.trim() ||
      !expense.category ||
      !expense.paidBy
    ) {
      Alert.alert(
        "Invalid Form Data",
        "Please fill in all required fields before submitting.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await mutateAsync(expense);
      navigation.goBack();
    } catch (error) {
      console.error("Error saving expense:", error);
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Header title="Add Expense" />

        {/* Date Picker */}
        <DatePicker date={expense.date} onDateChange={handleDateChange} />

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Amount */}
          <AmountInputs
            amount={expense.amount}
            subAmounts={expense.subAmounts}
            onAmountChange={(value) => handleChange("amount", value)}
            onSubAmountsChange={(subAmounts) =>
              handleChange("subAmounts", subAmounts)
            }
          />

          {/* Reason Field */}
          <FormInput
            value={expense.reason}
            setValue={(reason) => handleChange("reason", reason)}
            label="Reason"
            placeholder="Enter reason"
          />

          {/* Note Field */}
          <FormInput
            value={expense.note}
            setValue={(note) => handleChange("note", note)}
            label="Note (Optional)"
            placeholder="Enter note"
            keyboardType="default"
            textarea={true}
          />

          {/* Category Field */}
          <CategoryPicker
            selectedCategory={expense.category}
            onCategoryChange={(category) => handleChange("category", category)}
          />

          {/* Person Selection */}
          <PersonSelector
            persons={persons}
            selectedPerson={expense.paidBy}
            onPersonChange={(paidBy) => {
              setExpense((prev) => ({
                ...prev,
                paidBy,
                splitInHalf: paidBy === "Both" ? false : prev.splitInHalf,
              }));
            }}
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
            onValueChange={(excluded) => handleChange("excluded", excluded)}
            disabled={disableExclude}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.saveButtonText}>
            {isSubmitting ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
