import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type CommonHeaderProps = {
  title: string;
  onBackPress?: () => void;
};

export default function CommonHeader({
  title,
  onBackPress,
}: CommonHeaderProps) {
  const router = useRouter();

  function handleBack() {
    if (onBackPress) {
      onBackPress();
      return;
    }

    router.back();
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleBack}
        hitSlop={10}
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
      >
        <Ionicons
          name="arrow-back"
          size={30}
          color={GLOBAL_STYLES.colors.primary}
        />
      </Pressable>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  backButton: {
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 0,
    paddingRight: 6,
    paddingVertical: 2,
  },
  pressed: {
    opacity: 0.4,
  },
  title: {
    flex: 1,
    textAlign: "left",
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    marginLeft: 6,
  },
});
