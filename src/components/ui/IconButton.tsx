import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";

interface Props {
  name: React.ComponentProps<typeof Ionicons>["name"];
  onPress: () => void;
  size?: number;
  color?: "primary" | "danger";
}

export default function IconButton({
  name,
  onPress,
  size = 30,
  color = "primary",
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{
        color: GLOBAL_STYLES.colors.primary,
        borderless: true,
        radius: 24,
      }}
      style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
    >
      <Ionicons name={name} size={size} color={GLOBAL_STYLES.colors[color]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.4,
  },
});
