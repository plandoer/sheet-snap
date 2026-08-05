import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { GLOBAL_STYLES } from "../../constants/global-styles";

interface Props {
  onAutoAdjust: () => void;
}

export default function AutoAdjustButton({ onAutoAdjust }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.autoAdjustButton}
      onPress={onAutoAdjust}
    >
      <Ionicons
        name="sparkles-outline"
        size={16}
        color={GLOBAL_STYLES.colors.primary}
      />
      <Text style={styles.autoAdjustButtonText}>Auto Adjust</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  autoAdjustButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: GLOBAL_STYLES.colors.primary,
    backgroundColor: GLOBAL_STYLES.colors.surfaceMuted,
  },
  autoAdjustButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: GLOBAL_STYLES.colors.primary,
  },
});
