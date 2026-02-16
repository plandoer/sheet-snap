import { StyleSheet, TouchableOpacity } from "react-native";

type Props = {
  onPress: () => void;
  children: React.ReactElement;
  disabled?: boolean;
};

export default function Button({ onPress, children, disabled = false }: Props) {
  return (
    <TouchableOpacity
      style={[styles.btn, disabled && styles.btnDisabled]}
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
    backgroundColor: "#34A853",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 32,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  btnDisabled: {
    backgroundColor: "#9E9E9E",
    opacity: 0.6,
  },
});
