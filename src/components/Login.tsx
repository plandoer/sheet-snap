import Button from "@/components/ui/Buttton";
import { useLogin } from "@/hooks/useLogin";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import CustomStatusBar from "./CustomStatusBar";

export default function Login() {
  const { isLoading, login } = useLogin();

  let btnIcon = null;
  let btnText = null;

  if (isLoading) {
    btnIcon = <ActivityIndicator color="#FFFFFF" style={styles.googleIcon} />;
    btnText = "Signing in...";
  } else {
    btnIcon = (
      <MaterialCommunityIcons
        name="google"
        size={20}
        color="#FFFFFF"
        style={styles.googleIcon}
      />
    );
    btnText = "Login with Google";
  }

  return (
    <>
      <CustomStatusBar />
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
          <Button onPress={login} disabled={isLoading}>
            <View style={styles.buttonWrapper}>
              {btnIcon}
              <Text style={styles.loginButtonText}>{btnText}</Text>
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
