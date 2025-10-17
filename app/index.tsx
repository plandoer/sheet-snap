import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.container}>
        <View style={styles.welcomeContainer}>
          {/* Logo */}
          <MaterialCommunityIcons
            name="google-spreadsheet"
            size={100}
            color="#34A853"
            style={styles.logo}
          />

          {/* Title */}
          <Text style={styles.title}>Welcome to Sheet Snap</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Snapping expenses to{" "}
            <Text style={styles.googleSheetText}>Google Sheet</Text>
          </Text>

          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton} activeOpacity={0.8}>
            <MaterialCommunityIcons
              name="google"
              size={20}
              color="#FFFFFF"
              style={styles.googleIcon}
            />
            <Text style={styles.loginButtonText}>Login with Google</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made by <Text style={styles.plandoerText}>Plandoer</Text>
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  welcomeContainer: {
    alignItems: "center",
    width: "100%",
    marginBottom: 100,
  },
  logo: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 12,
    textAlign: "center",
  },
  googleSheetText: {
    fontWeight: "bold",
    color: "#34A853",
  },
  loginButton: {
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
  googleIcon: {
    marginRight: 8,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  plandoerText: {
    fontWeight: "bold",
    color: "#34A853",
  },
});
