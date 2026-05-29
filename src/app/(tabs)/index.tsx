import CategoryPicker from "@/components/sheetForm/CategoryPicker";
import DatePicker from "@/components/sheetForm/DatePicker";
import FormHeader from "@/components/sheetForm/FormHeader";
import { FormInput } from "@/components/sheetForm/FormInput";
import PersonSelector from "@/components/sheetForm/PersonSelector";
import Toggler from "@/components/Toggler";
import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useSaveToGoogleSheet } from "@/hooks/useGoogleSheet";
import { SheetFormData, initFormData } from "@/models/form";
import { Person } from "@/models/person";
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

const persons: Person[] = [
  new Person(1, "Ye"),
  new Person(2, "Pont"),
  new Person(3, "Both"),
];

export default function QuickAddScreen() {
  const [formData, setFormData] = useState<SheetFormData>(initFormData());
  const { isSubmitting, error, save } = useSaveToGoogleSheet();

  function handleDateChange(date?: Date) {
    if (!date) return;
    setFormData((prev) => ({ ...prev, selectedDate: date }));
  }

  function handleSubmit() {
    save(formData).then(() => {
      Alert.alert("Success", "Data saved to Google Sheet successfully!");
      setFormData(initFormData());
    });
  }

  useEffect(() => {
    if (error) Alert.alert(error.title, error.message);
  }, [error]);

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
          date={formData.selectedDate}
          onDateChange={handleDateChange}
        />

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Amount */}
          <FormInput
            value={formData.amount}
            setValue={(value) =>
              setFormData((prev) => ({ ...prev, amount: value }))
            }
            label="Amount"
            placeholder="Enter amount"
            keyboardType="numeric"
          />

          {/* Reason Field */}
          <FormInput
            value={formData.reason}
            setValue={(value) =>
              setFormData((prev) => ({ ...prev, reason: value }))
            }
            label="Reason"
            placeholder="Enter reason"
          />

          {/* Note Field */}
          <FormInput
            value={formData.note}
            setValue={(value) =>
              setFormData((prev) => ({ ...prev, note: value }))
            }
            label="Note (Optional)"
            placeholder="Enter note"
            keyboardType="default"
            textarea={true}
          />

          {/* Category Field */}
          <CategoryPicker
            selectedCategory={formData.category}
            onCategoryChange={(category) =>
              setFormData((prev) => ({ ...prev, category }))
            }
          />

          {/* Person Selection */}
          <PersonSelector
            persons={persons}
            selectedPerson={formData.selectedPerson}
            onPersonChange={(person) =>
              setFormData((prev) => ({
                ...prev,
                selectedPerson: person,
                splitInHalf: person === "Both" ? false : prev.splitInHalf,
              }))
            }
          />

          {/* Split in Half Toggle */}
          {formData.selectedPerson !== "" &&
            formData.selectedPerson !== "Both" && (
              <Toggler
                label="Split in Half"
                value={formData.splitInHalf}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, splitInHalf: value }))
                }
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
