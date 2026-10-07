import { GLOBAL_STYLES } from "@/constants/global-styles";
import { getSanitizedNumericValue } from "@/utils/validationUtils";
import { ReactNode } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface Props {
  value: string;
  setValue: (text: string) => void;
  label: string;
  placeholder: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  textarea?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  maxLength?: number;
  rightAccessory?: ReactNode;
}

export function FormInput({
  value,
  setValue,
  label,
  placeholder,
  keyboardType = "default",
  textarea = false,
  disabled = false,
  errorMessage = "",
  maxLength = 100,
  rightAccessory,
}: Props) {
  let labelText = label;

  function handleChange(text: string) {
    if (keyboardType === "numeric") {
      setValue(getSanitizedNumericValue(text));
    } else {
      setValue(text);
    }
  }

  if (errorMessage) {
    labelText = errorMessage;
  }

  return (
    <View style={styles.fieldContainer}>
      <Text style={[styles.label, errorMessage && styles.labelError]}>
        {labelText}
      </Text>
      <View style={[styles.inputContainer, disabled && styles.inputDisabled]}>
        <TextInput
          style={[styles.input, textarea && styles.textarea]}
          value={value}
          onChangeText={(text) => handleChange(text)}
          placeholder={placeholder}
          keyboardType={keyboardType}
          multiline={textarea}
          numberOfLines={textarea ? 4 : 1}
          editable={!disabled}
          maxLength={maxLength}
        />
        {rightAccessory}
      </View>
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
    color: GLOBAL_STYLES.colors.textPrimary,

    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: GLOBAL_STYLES.colors.backgroundColor,
    borderWidth: 1,
    borderColor: GLOBAL_STYLES.colors.borderColor,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: GLOBAL_STYLES.colors.textPrimary,
  },
  textarea: {
    textAlignVertical: "top",
  },
  inputDisabled: {
    backgroundColor: GLOBAL_STYLES.colors.disableBackground,
    borderColor: GLOBAL_STYLES.colors.disableBorder,
    color: GLOBAL_STYLES.colors.disableText,
  },
  labelError: {
    color: GLOBAL_STYLES.colors.danger,
  },
});
