import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity } from "react-native";

interface Props {
  date: Date;
  onDateChange: (date: Date) => void;
  errorMessage?: string;
}

export default function DatePicker({
  date,
  onDateChange,
  errorMessage,
}: Props) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  function showDatePickerModal() {
    setShowDatePicker(true);
  }

  function handleDateChange(event: any, date?: Date) {
    setShowDatePicker(Platform.OS === "ios");
    if (date) {
      onDateChange(date);
    }
  }

  return (
    <>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      <TouchableOpacity onPress={showDatePickerModal}>
        <Text style={styles.dateText}>{`${date.getDate()} ${date.toLocaleString(
          "default",
          { month: "short" },
        )}, ${date.getFullYear()}`}</Text>
      </TouchableOpacity>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  dateText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },
  errorText: {
    color: "red",
    fontWeight: "500",
  },
});
