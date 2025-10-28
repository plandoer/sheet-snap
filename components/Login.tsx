import Button from "@/components/ui/Buttton";
import { signInWithGoogle } from "@/config/google-signin";
import { useUser } from "@/context/UserContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUser();

  async function handleGoogleLogin() {
    try {
      setIsLoading(true);
      const userInfo = await signInWithGoogle();

      if (userInfo.type === "cancelled") {
        Alert.alert("👋 Hey", "Please login to continue using the app.");
        return;
      }

      if (userInfo.data?.user) {
        setUser({
          id: userInfo.data.user.id,
          name: userInfo.data.user.name,
          email: userInfo.data.user.email,
          photo: userInfo.data.user.photo,
        });
      }

      router.replace("/home");
    } catch (error: any) {
      console.error("Login failed:", error);

      Alert.alert(
        "Login Failed",
        error.message ||
          "An error occurred during Google Sign-In. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <StatusBar barStyle="dark-content" />
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
          <Button onPress={handleGoogleLogin} disabled={isLoading}>
            <View style={styles.buttonWrapper}>
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" style={styles.googleIcon} />
              ) : (
                <MaterialCommunityIcons
                  name="google"
                  size={20}
                  color="#FFFFFF"
                  style={styles.googleIcon}
                />
              )}
              <Text style={styles.loginButtonText}>
                {isLoading ? "Signing in..." : "Login with Google"}
              </Text>
            </View>
          </Button>
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
  googleIcon: {
    marginRight: 8,
  },
  buttonWrapper: {
    flexDirection: "row",
    alignItems: "center",
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
