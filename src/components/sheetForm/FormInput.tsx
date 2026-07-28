import { GLOBAL_STYLES } from "@/constants/global-styles";
import { getSantizedNumericValue } from "@/utils/validationUtils";
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
}: Props) {
  let labelText = label;

  function handleChange(text: string) {
    if (keyboardType === "numeric") {
      setValue(getSantizedNumericValue(text));
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
      <TextInput
        style={[styles.input, disabled && styles.inputDisabled]}
        value={value}
        onChangeText={(text) => handleChange(text)}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={textarea}
        numberOfLines={textarea ? 4 : 1}
        editable={!disabled}
        maxLength={maxLength}
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
    color: GLOBAL_STYLES.colors.textPrimary,

    marginBottom: 8,
  },
  input: {
    backgroundColor: GLOBAL_STYLES.colors.backgroundColor,
    borderWidth: 1,
    borderColor: GLOBAL_STYLES.colors.borderColor,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: GLOBAL_STYLES.colors.textPrimary,
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
