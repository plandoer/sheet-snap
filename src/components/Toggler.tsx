import { StyleSheet, Switch, Text, View } from "react-native";
import { GLOBAL_STYLES } from "../constants/global-styles";

interface Props {
  label: string;
  value: boolean;
  disabled?: boolean;
  onValueChange: (value: boolean) => void;
}

export default function Toggler({
  label,
  value,
  disabled,
  onValueChange,
}: Props) {
  return (
    <View style={styles.container}>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: "#9ca3af",
          true: disabled ? "#9ca3af" : GLOBAL_STYLES.colors.primary,
        }}
        thumbColor="#ffffff"
        ios_backgroundColor="#9ca3af"
        disabled={disabled}
      />
      <Text style={[styles.label, disabled && styles.disabled]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  disabled: {
    color: "#9ca3af",
  },
});
