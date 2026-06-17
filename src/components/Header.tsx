import { useRouter } from "expo-router";
import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import IconButton from "./ui/IconButton";

type Props = {
  title: string;
  onBackPress?: () => void;
  children?: ReactNode;
};

export default function Header({ title, onBackPress, children }: Props) {
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
      {/* Back Button */}
      <IconButton name="arrow-back" onPress={handleBack} />

      {/* Title */}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {/* Optional Actions */}
      {children}
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
