import Button from "@/components/Buttton";
import LoadingOverlay from "@/components/LoadingOverlay";
import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useExpenseGroupContext } from "@/context/ExpenseGroupContext";
import { useUser } from "@/context/UserContext";
import {
  useExpenseGroups,
  useGroupByInvitationToken,
  useJoinExpenseGroupByToken,
} from "@/hooks/useExpenseGroup";
import { useLogin } from "@/hooks/useLogin";
import { getErrorInfo } from "@/utils/errorUtils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";

export default function JoinGroupScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const router = useRouter();
  const { user } = useUser();
  const { isLoading: isLoggingIn, login } = useLogin();
  const { updateCurrentGroup } = useExpenseGroupContext();

  const {
    data: preview,
    isLoading: isLoadingPreview,
    isError: isPreviewError,
  } = useGroupByInvitationToken(token);
  const { mutateAsync: joinGroupAsync, isPending: isJoining } =
    useJoinExpenseGroupByToken();
  const { data: expenseGroups } = useExpenseGroups();

  // Guards against re-joining on re-renders once the join request has fired
  const hasJoinedRef = useRef(false);

  useEffect(() => {
    async function joinAndSelectGroup() {
      if (!token || !user || hasJoinedRef.current) return;
      hasJoinedRef.current = true;

      try {
        await joinGroupAsync(token);
      } catch (error) {
        const errorInfo = getErrorInfo(error);
        Alert.alert(errorInfo.title, errorInfo.message);
        router.replace("/(tabs)");
      }
    }
    joinAndSelectGroup();
  }, [token, user, joinGroupAsync, router]);

  useEffect(() => {
    if (!hasJoinedRef.current || !expenseGroups) return;

    const joinedGroup = expenseGroups.find((group) => group.id === preview?.id);
    if (joinedGroup) {
      updateCurrentGroup(joinedGroup);
      router.replace("/(tabs)");
    }
  }, [expenseGroups, preview, updateCurrentGroup, router]);

  async function handleLogin() {
    try {
      await login();
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message);
    }
  }

  if (!token || isPreviewError) {
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
        <Button
          onPress={() => router.replace(user ? "/(tabs)" : "/(auth)/sign-in")}
        >
          <Text style={styles.loginButtonText}>Continue</Text>
        </Button>
      </View>
    );
  }

  if (isLoadingPreview) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={GLOBAL_STYLES.colors.primary} />
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
      <Text style={styles.title}>Join &quot;{preview?.name}&quot;</Text>
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
