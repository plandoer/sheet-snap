import CustomStatusBar from "@/components/CustomStatusBar";
import SheetPicker from "@/components/SheetPicker";
import { useSheet } from "@/context/SheetContext";
import { useUser } from "@/context/UserContext";
import { categories } from "@/data/category";
import { SheetFormData, initFormData } from "@/models/form";
import { appendToGoogleSheet } from "@/services/google-drive";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import {
  Alert,
  Image,
  Platform,
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

  const { selectedSheet } = useSheet();
  const [showSheetPicker, setShowSheetPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();

  function handleDateChange(event: any, date?: Date) {
    setShowDatePicker(Platform.OS === "ios");
    if (date) {
      setFormData((prev) => ({ ...prev, selectedDate: date }));
    }
  }

  function showDatePickerModal() {
    setShowDatePicker(true);
  }

  async function handleSubmit() {
    // Prevent multiple submissions
    if (isSubmitting) return;

    // Validate required fields
    if (
      !formData.amount.trim() ||
      !formData.reason.trim() ||
      !formData.category ||
      !formData.selectedPerson
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (!selectedSheet) {
      Alert.alert("Error", "Please select a Google Sheet first");
      return;
    }

    setIsSubmitting(true);

    try {
      // Format selected date as "26 Oct, 2025"
      const formattedDate = `${formData.selectedDate.getDate()} ${formData.selectedDate.toLocaleString(
        "default",
        {
          month: "short",
        }
      )}, ${formData.selectedDate.getFullYear()}`;

      const totalAmount = parseFloat(formData.amount.trim()) || 0;

      if (formData.selectedPerson === "Both") {
        // Split amount in half and create two rows
        const halfAmount = totalAmount / 2;

        // Create row for Ye
        const yeRowData = [
          formattedDate,
          halfAmount,
          "Ye",
          formData.category,
          formData.reason.trim(),
          formData.note.trim(),
        ];

        // Create row for Pont
        const pontRowData = [
          formattedDate,
          halfAmount,
          "Pont",
          formData.category,
          formData.reason.trim(),
          formData.note.trim(),
        ];

        // Append both rows to the sheet
        await appendToGoogleSheet(
          selectedSheet.spreadsheet.id,
          selectedSheet.sheet.properties.title,
          yeRowData
        );

        await appendToGoogleSheet(
          selectedSheet.spreadsheet.id,
          selectedSheet.sheet.properties.title,
          pontRowData
        );
      } else {
        // Single person - create one row
        const rowData = [
          formattedDate,
          totalAmount,
          formData.selectedPerson,
          formData.category,
          formData.reason.trim(),
          formData.note.trim(),
        ];

        await appendToGoogleSheet(
          selectedSheet.spreadsheet.id,
          selectedSheet.sheet.properties.title,
          rowData
        );
      }

      // Clear form on success
      setFormData(initFormData());

      Alert.alert("Success", "Data saved to Google Sheet successfully!");
    } catch (error) {
      console.error("Error saving to sheet:", error);
      Alert.alert(
        "Error",
        "Failed to save data to Google Sheet. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
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
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={styles.sheetSelector}
                onPress={() => setShowSheetPicker(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.headerTitle}>
                  {selectedSheet?.spreadsheet?.name
                    ? `Sync to ${selectedSheet.spreadsheet.name} - ${selectedSheet.sheet.properties.title}`
                    : "Select a Google Sheet"}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={20}
                  color="#666"
                  style={styles.chevronIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={showDatePickerModal}>
                <Text
                  style={styles.dateText}
                >{`${formData.selectedDate.getDate()} ${formData.selectedDate.toLocaleString(
                  "default",
                  { month: "short" }
                )}, ${formData.selectedDate.getFullYear()}`}</Text>
              </TouchableOpacity>
            </View>
            {user?.photo && (
              <Image source={{ uri: user.photo }} style={styles.profileImage} />
            )}
          </View>

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

        {/* Sheet Picker Modal */}
        <SheetPicker
          visible={showSheetPicker}
          onClose={() => setShowSheetPicker(false)}
        />

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={formData.selectedDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
          />
        )}
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
  header: {
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flex: 1,
    marginRight: 16,
  },
  sheetSelector: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    marginRight: 4,
  },
  chevronIcon: {
    marginTop: 2,
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
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
