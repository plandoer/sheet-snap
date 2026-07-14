import { GLOBAL_STYLES } from "@/constants/global-styles";
import React from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";

interface Props {
  visible: boolean;
  message?: string;
}

export default function LoadingOverlay({
  visible,
  message = "Please wait...",
}: Props) {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={() => {}} // Prevents Android hardware back button from dismissing it
    >
      <View style={styles.overlay}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={GLOBAL_STYLES.colors.white} />
          {message ? <Text style={styles.loaderText}>{message}</Text> : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: GLOBAL_STYLES.colors.overlay, // Dims the background
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    backgroundColor: GLOBAL_STYLES.colors.surfaceDark,
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 120,
    shadowColor: GLOBAL_STYLES.colors.black,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
  },
  loaderText: {
    color: GLOBAL_STYLES.colors.white,
    marginTop: 12,
    fontWeight: "600",
    textAlign: "center", // Centers the text below the spinner
    paddingHorizontal: 8,
  },
});
