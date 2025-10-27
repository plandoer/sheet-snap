import Button from "@/components/ui/Buttton";
import {
  configureGoogleSignIn,
  signInWithGoogle,
} from "@/config/google-signin";
import { useUser } from "@/context/UserContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUser();

  useEffect(() => {
    // Configure Google Sign-In when component mounts
    configureGoogleSignIn();
  }, []);

  async function handleGoogleLogin() {
    try {
      setIsLoading(true);

      // Perform Google Sign-In
      const userInfo = await signInWithGoogle();

      // Log user profile information
      console.log("===== Google Sign-In Success =====");
      console.log("User ID:", userInfo.data?.user.id);
      console.log("Name:", userInfo.data?.user.name);
      console.log("Email:", userInfo.data?.user.email);
      console.log("Profile Picture:", userInfo.data?.user.photo);
      console.log("===================================");

      // Save user info to context
      if (userInfo.data?.user) {
        setUser({
          id: userInfo.data.user.id,
          name: userInfo.data.user.name,
          email: userInfo.data.user.email,
          photo: userInfo.data.user.photo,
        });
      }

      // Navigate to home screen after successful login
      router.replace("/home");
    } catch (error: any) {
      console.error("Login failed:", error);

      // Show error message to user
      Alert.alert(
        "Login Failed",
        error.message ||
          "An error occurred during Google Sign-In. Please try again.",
        [{ text: "OK" }]
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
