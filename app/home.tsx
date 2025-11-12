import CustomStatusBar from "@/components/CustomStatusBar";
import DatePicker from "@/components/sheetForm/DatePicker";
import FormHeader from "@/components/sheetForm/FormHeader";
import { categories } from "@/data/category";
import { useSaveToGoogleSheet } from "@/hooks/useGoogleSheet";
import { SheetFormData, initFormData } from "@/models/form";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
    await save(formData);
    setFormData(initFormData());
  }

  return (
    <>
      <CustomStatusBar />
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
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
            {/* Amount Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.input}
                value={formData.amount}
                onChangeText={(value) =>
                  setFormData((prev) => ({ ...prev, amount: value }))
                }
                placeholder="Enter amount"
                keyboardType="numeric"
              />
            </View>

            {/* Reason Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Reason</Text>
              <TextInput
                style={styles.input}
                value={formData.reason}
                onChangeText={(value) =>
                  setFormData((prev) => ({ ...prev, reason: value }))
                }
                placeholder="Enter reason"
              />
            </View>

            {/* Note Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Note (Optional)</Text>
              <TextInput
                style={[styles.input, styles.noteInput]}
                value={formData.note}
                onChangeText={(value) =>
                  setFormData((prev) => ({ ...prev, note: value }))
                }
                placeholder="Enter note"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Category Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Category</Text>
              <Picker
                selectedValue={formData.category}
                onValueChange={(itemValue) =>
                  setFormData((prev) => ({ ...prev, category: itemValue }))
                }
                style={styles.categoryPicker}
              >
                <Picker.Item label="Select a category" value="" />
                {categories.map((cat) => (
                  <Picker.Item key={cat} label={cat} value={cat} />
                ))}
              </Picker>
            </View>

            {/* Person Selection */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Person</Text>
              <View style={styles.personContainer}>
                <TouchableOpacity
                  style={[
                    styles.personButton,
                    formData.selectedPerson === "Ye" &&
                      styles.personButtonSelected,
                  ]}
                  onPress={() =>
                    setFormData((prev) => ({ ...prev, selectedPerson: "Ye" }))
                  }
                >
                  <Text
                    style={[
                      styles.personButtonText,
                      formData.selectedPerson === "Ye" &&
                        styles.personButtonTextSelected,
                    ]}
                  >
                    Ye
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.personButton,
                    formData.selectedPerson === "Pont" &&
                      styles.personButtonSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={() =>
                    setFormData((prev) => ({ ...prev, selectedPerson: "Pont" }))
                  }
                >
                  <Text
                    style={[
                      styles.personButtonText,
                      formData.selectedPerson === "Pont" &&
                        styles.personButtonTextSelected,
                    ]}
                  >
                    Pont
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.personButton,
                    formData.selectedPerson === "Both" &&
                      styles.personButtonSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={() =>
                    setFormData((prev) => ({ ...prev, selectedPerson: "Both" }))
                  }
                >
                  <Text
                    style={[
                      styles.personButtonText,
                      formData.selectedPerson === "Both" &&
                        styles.personButtonTextSelected,
                    ]}
                  >
                    Both
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
    marginBottom: 30,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e1e5e9",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  noteInput: {
    height: 80,
    textAlignVertical: "top",
  },
  personContainer: {
    flexDirection: "row",
    gap: 12,
  },
  personButton: {
    backgroundColor: "#e9ecef",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  personButtonSelected: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  personButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#495057",
  },
  personButtonTextSelected: {
    color: "#fff",
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

  categoryPicker: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e1e5e9",
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
  },
});
