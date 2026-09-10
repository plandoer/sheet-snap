import { GLOBAL_STYLES } from "@/constants/global-styles";
import { StyleSheet, TouchableOpacity } from "react-native";

interface Props {
  onPress: () => void;
  children: React.ReactElement;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

export default function Button({
  onPress,
  children,
  disabled = false,
  variant = "primary",
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        variant === "secondary" && styles.btnSecondary,
        disabled && styles.btnDisabled,
      ]}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: GLOBAL_STYLES.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 32,
    width: "80%",
    shadowColor: GLOBAL_STYLES.colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  btnDisabled: {
    backgroundColor: GLOBAL_STYLES.colors.disabledButton,
    opacity: 0.6,
  },
  btnSecondary: {
    backgroundColor: GLOBAL_STYLES.colors.transparent,
    borderColor: GLOBAL_STYLES.colors.primary,
    borderWidth: 1,
    shadowOpacity: 0,
    elevation: 0,
  },
});
