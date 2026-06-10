import CategoryPicker from "@/components/sheetForm/CategoryPicker";
import DatePicker from "@/components/sheetForm/DatePicker";
import FormHeader from "@/components/sheetForm/FormHeader";
import { FormInput } from "@/components/sheetForm/FormInput";
import PersonSelector from "@/components/sheetForm/PersonSelector";
import Toggler from "@/components/Toggler";
import { GLOBAL_STYLES } from "@/constants/global-styles";
import { persons } from "@/data/personData";
import { useSaveToGoogleSheet } from "@/hooks/useGoogleSheet";
import { useLogin } from "@/hooks/useLogin";
import { ErrorType } from "@/models/enums/errorType";
import { SheetFormData, initFormData } from "@/models/form";
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

export default function QuickAddScreen() {
  const [formData, setFormData] = useState<SheetFormData>(initFormData());
  const { isSubmitting, save } = useSaveToGoogleSheet();
  const { logout } = useLogin();
  const personsWithBothOption = [...persons, new Person(3, "Both")];
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
        setFormData(initFormData());
      })
      .catch((error) => {
        const errorInfo = getErrorInfo(error);
        Alert.alert(errorInfo.title, errorInfo.message, [
          {
            text: "OK",
            onPress: () => handleTokenRevoke(error),
          },
        ]);
      });
  }

  async function handleTokenRevoke(error: unknown) {
    if (error instanceof Error && error.name === ErrorType.TOKEN_REVOKED) {
      await logout().catch((logoutError) => {
        const logoutErrorInfo = getErrorInfo(logoutError);
        Alert.alert(logoutErrorInfo.title, logoutErrorInfo.message);
      });
    }
  }

  function handlePersonChange(selectedPerson: string) {
    handleValue(selectedPerson, "selectedPerson");
    if (selectedPerson === "Both") {
      handleValue(false, "splitInHalf");
    }
  }

  function handleValue(
    value: string | Date | boolean,
    field: keyof SheetFormData,
  ) {
    setErrorMessages((prev) => ({ ...prev, [field]: "" }));
    setFormData((prev) => ({ ...prev, [field]: value }));
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
        <FormHeader />

        {/* Date Picker */}
        <DatePicker
          errorMessage={errorMessages.selectedDate}
          date={formData.selectedDate}
          onDateChange={(date) => handleValue(date, "selectedDate")}
        />

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
            errorMessage={errorMessages.category}
            selectedCategory={formData.category}
            onCategoryChange={(category) => handleValue(category, "category")}
          />

          {/* Person Selection */}
          <PersonSelector
            errorMessage={errorMessages.selectedPerson}
            persons={personsWithBothOption}
            selectedPerson={formData.selectedPerson}
            onPersonChange={(person) => handlePersonChange(person)}
          />

          {/* Split in Half Toggle */}
          {formData.selectedPerson !== "" &&
            formData.selectedPerson !== "Both" && (
              <Toggler
                label="Split in Half"
                value={formData.splitInHalf}
                onValueChange={(value) => handleValue(value, "splitInHalf")}
              />
            )}
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
