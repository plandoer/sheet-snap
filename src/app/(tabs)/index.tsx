import CategoryPicker from "@/components/expenseForm/CategoryPicker";
import DatePicker from "@/components/expenseForm/DatePicker";
import ExpenseFormHeader from "@/components/expenseForm/ExpenseFormHeader";
import { FormInput } from "@/components/expenseForm/FormInput";
import PersonSelector from "@/components/expenseForm/PersonSelector";
import SheetPicker from "@/components/expenseForm/SheetPicker";
import EachShareAdjuster from "@/components/expenses/EachShareAdjuster";
import { GLOBAL_STYLES } from "@/constants/global-styles";
import { categories } from "@/data/categoryData";
import { personsWithBothOption } from "@/data/personData";
import { useSaveToGoogleSheet } from "@/hooks/useGoogleSheet";
import { EachShare } from "@/models/eachShare";
import { ExpenseFormData } from "@/models/expenseFormData";
import { Person } from "@/models/person";
import { getErrorInfo } from "@/utils/errorUtils";
import { validateForm } from "@/utils/validationUtils";
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

const CURRENCY = "THB";

export default function QuickAddScreen() {
  const [formData, setFormData] = useState<ExpenseFormData>(
    new ExpenseFormData(),
  );
  const [selectedPerson, setSelectedPerson] = useState<Person>(new Person());
  const [eachShares, setEachShares] = useState<EachShare[]>([]);

  const { isSubmitting, save } = useSaveToGoogleSheet();
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>(
    {},
  );

  function handleSubmit() {
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }

    save(formData)
      .then(() => {
        Alert.alert("Success", "Data saved to Google Sheet successfully!");
        resetForm();
      })
      .catch((error) => {
        const errorInfo = getErrorInfo(error);
        Alert.alert(errorInfo.title, errorInfo.message);
      });
  }

  function handlePersonChange(selectedPerson: Person) {
    setSelectedPerson(selectedPerson);
    handleValue(selectedPerson.name, "selectedPerson");
  }

  function handleValue(value: string | Date, field: keyof ExpenseFormData) {
    setErrorMessages((prev) => ({ ...prev, [field]: "" }));
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleEachShares(shares: EachShare[]) {
    setEachShares(shares);
  }

  function resetForm() {
    setFormData(new ExpenseFormData());
    setSelectedPerson(new Person());
    setEachShares([]);
    setErrorMessages({});
  }

  return (
    <>
      {/* Header */}
      <ExpenseFormHeader />
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
            errorMessage={errorMessages.selectedDate}
            date={formData.selectedDate}
            onDateChange={(date) => handleValue(date, "selectedDate")}
          />

          {/* Destination */}
          <Text style={styles.fieldLabel}>Destination Sheet</Text>
          <View style={styles.pickerContainer}>
            <SheetPicker />
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Amount */}
            <FormInput
              value={formData.amount}
              setValue={(value) => handleValue(value, "amount")}
              label="Amount"
              errorMessage={errorMessages.amount}
              placeholder="Enter amount"
              keyboardType="numeric"
              maxLength={10}
            />

            {/* Reason Field */}
            <FormInput
              value={formData.reason}
              setValue={(value) => handleValue(value, "reason")}
              label="Reason"
              errorMessage={errorMessages.reason}
              placeholder="Enter reason"
            />

            {/* Note Field */}
            <FormInput
              value={formData.note}
              setValue={(value) => handleValue(value, "note")}
              label="Note (Optional)"
              errorMessage={errorMessages.note}
              placeholder="Enter note"
              keyboardType="default"
              textarea={true}
            />

            {/* Category Field */}
            <CategoryPicker
              showManageCategories={false}
              categories={categories ?? []}
              selectedCategoryId={
                categories?.find((c) => c.name === formData.category)?.id
              }
              errorMessage={errorMessages.category}
              onCategoryChange={(category) =>
                handleValue(category.name, "category")
              }
            />

            {/* Person Selection */}
            <PersonSelector
              showManagePersons={false}
              errorMessage={errorMessages.selectedPerson}
              persons={personsWithBothOption}
              selectedPerson={
                personsWithBothOption.find(
                  (person) => person.name === formData.selectedPerson,
                ) ?? null
              }
              onPersonChange={(person) => handlePersonChange(person)}
            />

            {/* Each Share  */}
            <EachShareAdjuster
              amount={formData.amount}
              paidBy={selectedPerson}
              eachShares={eachShares}
              currency={CURRENCY}
              errorMessage={errorMessages.eachShares}
              onEachSharesChange={handleEachShares}
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
    marginTop: 24,
    marginBottom: 8,
  },
  pickerContainer: {
    marginBottom: 24,
    borderWidth: 1,
    borderColor: GLOBAL_STYLES.colors.borderColor,
    borderRadius: 8,
    backgroundColor: GLOBAL_STYLES.colors.white,
  },
  dateText: {
    fontSize: 32,
    fontWeight: "bold",
    color: GLOBAL_STYLES.colors.black,
  },
  formContainer: {
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
    backgroundColor: GLOBAL_STYLES.colors.secondaryButton,
    opacity: 0.6,
  },
  saveButtonText: {
    color: GLOBAL_STYLES.colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
});
