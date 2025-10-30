import SheetPicker from "@/components/SheetPicker";
import { useSheet } from "@/context/SheetContext";
import { useUser } from "@/context/UserContext";
import { appendToGoogleSheet } from "@/services/google-drive";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Stack } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("");
  const [selectedPerson, setSelectedPerson] = useState("");
  const [showSheetPicker, setShowSheetPicker] = useState(false);
  const { user } = useUser();
  const { selectedSheet } = useSheet();

  const categories = [
    "Normal Food",
    "Special Food",
    "Bus",
    "Train",
    "Grab Taxi",
    "Boat",
    "Other Transportation",
    "Water",
    "Laundary",
    "Clothes",
    "Cosmetic",
    "Luxury",
    "Bill",
    "Home",
    "Other",
    "LTK",
    "Trip",
  ];

  const handleSubmit = async () => {
    // Validate required fields
    if (!amount.trim() || !reason.trim() || !category || !selectedPerson) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (!selectedSheet) {
      Alert.alert("Error", "Please select a Google Sheet first");
      return;
    }

    try {
      // Format current date as "26 Oct, 2025"
      const today = new Date();
      const formattedDate = `${today.getDate()} ${today.toLocaleString(
        "default",
        {
          month: "short",
        }
      )}, ${today.getFullYear()}`;

      // Map data to columns: Date, Amount, Person, Category, Reason, Note
      const rowData = [
        formattedDate,
        parseFloat(amount.trim()) || 0,
        selectedPerson,
        category,
        reason.trim(),
        note.trim(),
      ];

      await appendToGoogleSheet(
        selectedSheet.spreadsheet.id,
        selectedSheet.sheet.properties.title,
        rowData
      );

      // Clear form on success
      setAmount("");
      setReason("");
      setNote("");
      setCategory("");
      setSelectedPerson("");

      Alert.alert("Success", "Data saved to Google Sheet successfully!");
    } catch (error) {
      console.error("Error saving to sheet:", error);
      Alert.alert(
        "Error",
        "Failed to save data to Google Sheet. Please try again."
      );
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <StatusBar barStyle="dark-content" />
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
              <Text
                style={styles.dateText}
              >{`${new Date().getDate()} ${new Date().toLocaleString(
                "default",
                { month: "short" }
              )}, ${new Date().getFullYear()}`}</Text>
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
                value={amount}
                onChangeText={setAmount}
                placeholder="Enter amount"
                keyboardType="numeric"
              />
            </View>

            {/* Reason Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Reason</Text>
              <TextInput
                style={styles.input}
                value={reason}
                onChangeText={setReason}
                placeholder="Enter reason"
              />
            </View>

            {/* Note Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Note</Text>
              <TextInput
                style={[styles.input, styles.noteInput]}
                value={note}
                onChangeText={setNote}
                placeholder="Enter note"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Category Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Category</Text>
              <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
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
                    selectedPerson === "Ye" && styles.personButtonSelected,
                  ]}
                  onPress={() => setSelectedPerson("Ye")}
                >
                  <Text
                    style={[
                      styles.personButtonText,
                      selectedPerson === "Ye" &&
                        styles.personButtonTextSelected,
                    ]}
                  >
                    Ye
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.personButton,
                    selectedPerson === "Pont" && styles.personButtonSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedPerson("Pont")}
                >
                  <Text
                    style={[
                      styles.personButtonText,
                      selectedPerson === "Pont" &&
                        styles.personButtonTextSelected,
                    ]}
                  >
                    Pont
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.saveButton}
            onPress={handleSubmit}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Sheet Picker Modal */}
        <SheetPicker
          visible={showSheetPicker}
          onClose={() => setShowSheetPicker(false)}
        />
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
