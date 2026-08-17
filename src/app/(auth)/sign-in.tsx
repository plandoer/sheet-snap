import Button from "@/components/Buttton";
import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useLogin } from "@/hooks/useLogin";
import { getErrorInfo } from "@/utils/errorUtils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";

export default function SignInScreen() {
  const { isLoading, login } = useLogin();

  let btnIcon = null;
  let btnText = null;

  function handleLogin() {
    login().catch((error) => {
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message);
    });
  }

  if (isLoading) {
    btnIcon = (
      <ActivityIndicator
        color={GLOBAL_STYLES.colors.white}
        style={styles.googleIcon}
      />
    );
    btnText = "Signing in...";
  } else {
    btnIcon = (
      <MaterialCommunityIcons
        name="google"
        size={20}
        color={GLOBAL_STYLES.colors.white}
        style={styles.googleIcon}
      />
    );
    btnText = "Login with Google";
  }

  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        {/* Logo */}
        <MaterialCommunityIcons
          name="google-spreadsheet"
          size={100}
          color={GLOBAL_STYLES.colors.primary}
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
        <Button onPress={handleLogin} disabled={isLoading}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GLOBAL_STYLES.colors.backgroundColor,
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
    color: GLOBAL_STYLES.colors.textDark,
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: GLOBAL_STYLES.colors.textMedium,
    marginBottom: 12,
    textAlign: "center",
  },
  googleSheetText: {
    fontWeight: "bold",
    color: GLOBAL_STYLES.colors.primary,
  },
  googleIcon: {
    marginRight: 8,
  },
  buttonWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginButtonText: {
    color: GLOBAL_STYLES.colors.white,
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
    color: GLOBAL_STYLES.colors.textMuted,
    textAlign: "center",
  },
  plandoerText: {
    fontWeight: "bold",
    color: GLOBAL_STYLES.colors.primary,
  },
});
