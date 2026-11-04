import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useCategoriesByCurrentGroup } from "@/hooks/useCategory";
import { usePersonsByCurrentGroup } from "@/hooks/usePerson";
import { EachShare } from "@/models/eachShare";
import { Expense } from "@/models/expense";
import { calculateEqualShare } from "@/utils/expenseUtils";
import { validateExpenseForm } from "@/utils/validationUtils";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LoadingOverlay from "../LoadingOverlay";
import Toggler from "../Toggler";
import AmountInputs from "../expenses/AmountInputs";
import EachShareAdjuster from "../expenses/EachShareAdjuster";
import SheetPicker from "../sheetPicker/SheetPicker";
import CategoryPicker from "./CategoryPicker";
import DatePicker from "./DatePicker";
import { FormInput } from "./FormInput";
import PersonSelector from "./PersonSelector";

interface Props {
  expense?: Expense;
  showSheetPicker?: boolean;
  showExcludeToggle?: boolean;
  isSubmitting: boolean;
  onSubmit: (expense: Expense) => void;
}

export default function ExpenseForm({
  expense,
  showSheetPicker = false,
  showExcludeToggle = true,
  isSubmitting,
  onSubmit,
}: Props) {
  const [draftExpense, setDraftExpense] = useState<Expense>(new Expense());

  const draftAmount = useRef(draftExpense.amount);
  draftAmount.current = draftExpense.amount;

  const {
    data: persons,
    isLoading: isPersonsLoading,
    isPending: arePersonsPending,
  } = usePersonsByCurrentGroup();
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isPending: areCategoriesPending,
  } = useCategoriesByCurrentGroup();

  const [errorMessages, setErrorMessages] = useState<Record<string, string>>(
    {},
  );

  function handleValue(value: any, field: keyof Expense) {
    clearErrorMessageFor(field);
    setDraftExpense((prev) => ({ ...prev, [field]: value }));
  }

  function clearErrorMessageFor(field: keyof Expense) {
    setErrorMessages((prev) => ({ ...prev, [field]: "" }));
  }

  function handleAmountChange(value: string) {
    handleValue(value, "amount");

    const equalShare = calculateEqualShare(value, persons?.length ?? 0);

    const updatedShares = draftExpense.eachShares.map((share) => ({
      ...share,
      amount: equalShare,
    }));
    handleValue(updatedShares, "eachShares");
  }

  async function handleSubmit() {
    console.log("Submitting expense:", draftExpense);

    const errors = validateExpenseForm(draftExpense);
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }

    onSubmit(draftExpense);
  }

  useEffect(() => {
    if (expense) return;

    function initializeSharesForNewExpense() {
      if (!persons) return;

      const equalShare = calculateEqualShare(
        draftAmount.current,
        persons.length,
      );

      const initialShares = persons.map((person) => {
        const eachShare = new EachShare();
        eachShare.person = person;
        eachShare.amount = equalShare;
        return eachShare;
      });
      setDraftExpense((prev) => ({ ...prev, eachShares: initialShares }));
    }

    initializeSharesForNewExpense();
  }, [expense, persons]);

  useEffect(() => {
    if (expense) {
      setDraftExpense(expense);
    }
  }, [expense]);

  return (
    <>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Date Picker */}
          <DatePicker
            errorMessage={errorMessages.date}
            date={draftExpense.date}
            onDateChange={(date) => handleValue(date, "date")}
          />

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Destination Sheet */}
            {showSheetPicker && (
              <>
                <Text style={styles.fieldLabel}>Destination Sheet</Text>
                <View style={styles.pickerContainer}>
                  <SheetPicker />
                </View>
              </>
            )}

            {/* Amount */}
            <AmountInputs
              errorMessage={errorMessages.amount}
              amount={draftExpense.amount}
              subAmounts={draftExpense.subAmounts}
              onAmountChange={(value) => handleAmountChange(value)}
              onSubAmountsChange={(subAmounts) =>
                handleValue(subAmounts, "subAmounts")
              }
            />

            {/* Reason Field */}
            <FormInput
              errorMessage={errorMessages.reason}
              value={draftExpense.reason}
              setValue={(reason) => handleValue(reason, "reason")}
              label="Reason"
              placeholder="Enter reason"
            />

            {/* Note Field */}
            <FormInput
              value={draftExpense.note}
              setValue={(note) => handleValue(note, "note")}
              label="Note (Optional)"
              placeholder="Enter note"
              keyboardType="default"
              textarea={true}
            />

            {/* Category Field */}
            <CategoryPicker
              categories={categories ?? []}
              loading={isCategoriesLoading}
              pending={areCategoriesPending}
              errorMessage={errorMessages.category}
              selectedCategoryId={draftExpense.category.id}
              onCategoryChange={(category) => handleValue(category, "category")}
            />

            {/* Person Selection */}
            <PersonSelector
              persons={persons ?? []}
              loading={isPersonsLoading}
              pending={arePersonsPending}
              errorMessage={errorMessages.paidBy}
              customLabel="Paid By"
              selectedPerson={draftExpense.paidBy}
              onPersonChange={(person) => handleValue(person, "paidBy")}
            />

            {/* Exclude from calculation Toggle*/}
            {showExcludeToggle && (
              <Toggler
                label="Exclude from calculation"
                value={draftExpense.excluded}
                onValueChange={(excluded) => handleValue(excluded, "excluded")}
              />
            )}

            {/* Each Share  */}
            <EachShareAdjuster
              amount={draftExpense.amount}
              paidBy={draftExpense.paidBy}
              eachShares={draftExpense.eachShares}
              currency={draftExpense.currency}
              errorMessage={errorMessages.eachShares}
              onEachSharesChange={(eachShares) =>
                handleValue(eachShares, "eachShares")
              }
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
      <LoadingOverlay visible={isSubmitting} message="Saving, please wait..." />
    </>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: GLOBAL_STYLES.colors.backgroundColor,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: GLOBAL_STYLES.colors.textPrimary,
    marginBottom: 8,
  },
  pickerContainer: {
    marginBottom: 24,
    borderWidth: 1,
    borderColor: GLOBAL_STYLES.colors.borderColor,
    borderRadius: 8,
    backgroundColor: GLOBAL_STYLES.colors.white,
  },
  formContainer: {
    marginTop: 20,
    marginBottom: 30,
  },

  saveButton: {
    backgroundColor: GLOBAL_STYLES.colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: GLOBAL_STYLES.colors.secondaryButton,
    opacity: 0.6,
  },
  saveButtonText: {
    color: GLOBAL_STYLES.colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
});
