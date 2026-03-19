import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";

export default function IconButton({
  name,
  onPress,
}: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  onPress: () => void;
}) {
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
      <Ionicons name={name} size={22} color={GLOBAL_STYLES.colors.primary} />
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
