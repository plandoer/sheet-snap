import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

export default function ExpenseHeader() {
  return (
    <View style={styles.container}>
      <View>
        <Pressable
          onPress={() => {}}
          android_ripple={{
            color: GLOBAL_STYLES.colors.primary,
            borderless: true,
            radius: 20,
          }}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <Ionicons
            name="share"
            size={24}
            color={GLOBAL_STYLES.colors.primary}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GLOBAL_STYLES.colors.backgroundColor,
  },
  pressed: {
    opacity: 0.5,
  },
});
