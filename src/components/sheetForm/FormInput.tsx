import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  value: string;
  setValue: (text: string) => void;
  label: string;
  placeholder: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  textarea?: boolean;
};

export function FormInput({
  value,
  setValue,
  label,
  placeholder,
  keyboardType = "default",
  textarea = false,
}: Props) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={textarea}
        numberOfLines={textarea ? 4 : 1}
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
});
