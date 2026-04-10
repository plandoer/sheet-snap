import { StyleSheet, Text, TextInput, View } from "react-native";

interface Props {
  value: string;
  setValue: (text: string) => void;
  label: string;
  placeholder: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  textarea?: boolean;
  disabled?: boolean;
}

export function FormInput({
  value,
  setValue,
  label,
  placeholder,
  keyboardType = "default",
  textarea = false,
  disabled = false,
}: Props) {
  function validateNumericInput(text: string) {
    if (keyboardType === "numeric") {
      // Allow only numbers and a single period
      let cleaned = text.replace(/[^0-9.]/g, "");

      // Prevent more than one decimal point
      const parts = cleaned.split(".");
      if (parts.length > 2) {
        cleaned = parts[0] + "." + parts.slice(1).join("");
      }

      setValue(cleaned);
    } else {
      setValue(text);
    }
  }

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, disabled && styles.inputDisabled]}
        value={value}
        onChangeText={validateNumericInput}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={textarea}
        numberOfLines={textarea ? 4 : 1}
        editable={!disabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  inputDisabled: {
    backgroundColor: "#f2f2f2",
    borderColor: "#e1e5e9",
    color: "#888",
  },
});
