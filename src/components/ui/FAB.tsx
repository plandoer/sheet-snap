import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";

interface FABProps {
  onPress: () => void;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  color?: string;
  bottom?: number;
  right?: number;
}

export default function FAB({
  onPress,
  icon = "add",
  color = GLOBAL_STYLES.colors.primary,
  bottom = 28,
  right = 24,
}: FABProps) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{
        color: "#fff",
        borderless: false,
        radius: 28,
      }}
      style={({ pressed }) => [
        styles.fab,
        { backgroundColor: color, bottom, right },
        pressed && styles.pressed,
      ]}
    >
      <Ionicons name={icon} size={28} color="#fff" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
});
