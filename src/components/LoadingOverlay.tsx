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
          <ActivityIndicator size="large" color="#ffffff" />
          {message ? <Text style={styles.loaderText}>{message}</Text> : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dims the background
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    backgroundColor: "#222222",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 120,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
  },
  loaderText: {
    color: "#ffffff",
    marginTop: 12,
    fontWeight: "600",
    textAlign: "center", // Centers the text below the spinner
    paddingHorizontal: 8,
  },
});
