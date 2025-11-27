import CustomStatusBar from "@/components/CustomStatusBar";
import CategoryPicker from "@/components/sheetForm/CategoryPicker";
import DatePicker from "@/components/sheetForm/DatePicker";
import FormHeader from "@/components/sheetForm/FormHeader";
import { FormInput } from "@/components/sheetForm/FormInput";
import PersonSelector from "@/components/sheetForm/PersonSelector";
import { useSaveToGoogleSheet } from "@/hooks/useGoogleSheet";
import { SheetFormData, initFormData } from "@/models/form";
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
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [formData, setFormData] = useState<SheetFormData>(initFormData());
  const { save, isSubmitting } = useSaveToGoogleSheet();

  function handleDateChange(date?: Date) {
    if (!date) return;
    setFormData((prev) => ({ ...prev, selectedDate: date }));
  }

  async function handleSubmit() {
    await save(formData)
      .then(() => {
        setFormData(initFormData());
      })
      .catch((error) => {
        if (error === "Invalid form data") {
          Alert.alert("Error", "Please fill in all required fields");
        } else if (error === "No sheet selected") {
          Alert.alert("Error", "Please select a Google Sheet first");
        }
        console.error("Submission failed:", error);
      });
  }

  return (
    <>
      <CustomStatusBar />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
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
              selectedPerson={formData.selectedPerson}
              onPersonChange={(person) =>
                setFormData((prev) => ({ ...prev, selectedPerson: person }))
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
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  keyboardAvoidingView: {
    flex: 1,
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
    backgroundColor: "#28a745",
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
