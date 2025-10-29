import SheetPicker from "@/components/SheetPicker";
import { useSheet } from "@/context/SheetContext";
import { useUser } from "@/context/UserContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useState } from "react";
import {
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
              <Text style={styles.dateText}>27 Oct, 2025</Text>
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
              <TextInput
                style={styles.input}
                value={category}
                onChangeText={setCategory}
                placeholder="Enter category"
              />
            </View>

            {/* Person Selection */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Person</Text>
              <View style={styles.personContainer}>
                <TouchableOpacity
                  style={[
                    styles.personButton,
                    selectedPerson === "YMK" && styles.personButtonSelected,
                  ]}
                  onPress={() => setSelectedPerson("YMK")}
                >
                  <Text
                    style={[
                      styles.personButtonText,
                      selectedPerson === "YMK" &&
                        styles.personButtonTextSelected,
                    ]}
                  >
                    YMK
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.personButton,
                    selectedPerson === "PP" && styles.personButtonSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedPerson("PP")}
                >
                  <Text
                    style={[
                      styles.personButtonText,
                      selectedPerson === "PP" &&
                        styles.personButtonTextSelected,
                    ]}
                  >
                    PP
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.saveButton}
            onPress={() => {}}
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
});
