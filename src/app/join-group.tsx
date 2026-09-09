import Button from "@/components/Buttton";
import LoadingOverlay from "@/components/LoadingOverlay";
import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useExpenseGroupContext } from "@/context/ExpenseGroupContext";
import { useUser } from "@/context/UserContext";
import { useJoinExpenseGroup } from "@/hooks/useExpenseGroup";
import { useLogin } from "@/hooks/useLogin";
import { getErrorInfo } from "@/utils/errorUtils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function JoinGroupScreen() {
  const { name, token } = useLocalSearchParams<{
    name?: string;
    token?: string;
  }>();
  const router = useRouter();
  const { user } = useUser();
  const { isLoading: isLoggingIn, login } = useLogin();
  const { updateCurrentGroup } = useExpenseGroupContext();

  const {
    mutateAsync: joinGroupAsync,
    isPending: isJoining,
    isError,
  } = useJoinExpenseGroup();

  async function handleLogin() {
    try {
      await login();
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message);
    }
  }

  useEffect(() => {
    async function joinAndSelectGroup() {
      if (!token || !user) return;

      try {
        const joinedGroup = await joinGroupAsync(token);
        updateCurrentGroup(joinedGroup);
        router.replace("/(tabs)");
      } catch (error) {
        const errorInfo = getErrorInfo(error);
        Alert.alert(errorInfo.title, errorInfo.message);
        router.replace("/(tabs)");
      }
    }
    joinAndSelectGroup();
  }, [token, user, joinGroupAsync, updateCurrentGroup, router]);

  if (!token || isError) {
    return (
      <View style={styles.container}>
        <MaterialCommunityIcons
          name="link-variant-off"
          size={64}
          color={GLOBAL_STYLES.colors.textMuted}
        />
        <Text style={styles.title}>Invalid Invitation Link</Text>
        <Text style={styles.subtitle}>
          This invitation link is invalid or has expired.
        </Text>
        <Button onPress={() => router.replace("/")}>
          <Text style={styles.loginButtonText}>Continue</Text>
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="account-group"
        size={64}
        color={GLOBAL_STYLES.colors.primary}
      />
      <Text style={styles.title}>Join &quot;{name}&quot;</Text>
      <Text style={styles.subtitle}>
        {user
          ? "Adding you to this expense group..."
          : "Sign in with Google to join this expense group."}
      </Text>
      {!user && (
        <Button onPress={handleLogin} disabled={isLoggingIn}>
          <View style={styles.buttonWrapper}>
            <MaterialCommunityIcons
              name="google"
              size={20}
              color={GLOBAL_STYLES.colors.white}
              style={styles.googleIcon}
            />
            <Text style={styles.loginButtonText}>
              {isLoggingIn ? "Signing in..." : "Login with Google"}
            </Text>
          </View>
        </Button>
      )}
      <LoadingOverlay visible={isJoining} message="Joining group..." />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GLOBAL_STYLES.colors.backgroundColor,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: GLOBAL_STYLES.colors.textDark,
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: GLOBAL_STYLES.colors.textMedium,
    marginTop: 12,
    marginBottom: 8,
    textAlign: "center",
  },
  buttonWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  googleIcon: {
    marginRight: 8,
  },
  loginButtonText: {
    color: GLOBAL_STYLES.colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
