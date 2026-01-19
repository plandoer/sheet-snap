import { StyleSheet, Switch, Text, View } from "react-native";

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export default function SplitInHalfToggler({ value, onValueChange }: Props) {
  return (
    <View style={styles.switchContainer}>
      <Text style={styles.switchLabel}>Split in Half</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#d1d5db", true: "#60a5fa" }}
        thumbColor={value ? "#2563eb" : "#f3f4f6"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
});
