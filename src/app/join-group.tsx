import Button from "@/components/Buttton";
import LoadingOverlay from "@/components/LoadingOverlay";
import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useExpenseGroupContext } from "@/context/ExpenseGroupContext";
import { useJoinExpenseGroup } from "@/hooks/useExpenseGroup";
import { getErrorInfo } from "@/utils/errorUtils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function JoinGroupScreen() {
  const { name, token } = useLocalSearchParams<{
    name?: string;
    token?: string;
  }>();
  const router = useRouter();
  const { updateCurrentGroup } = useExpenseGroupContext();
  const { mutateAsync: joinGroupAsync, isPending } = useJoinExpenseGroup();

  async function handleJoinGroup() {
    if (!token) {
      Alert.alert(
        "Invalid Invitation Link",
        "This invitation link is invalid or has expired.",
      );
      router.replace("/");
      return;
    }

    try {
      const joinedGroup = await joinGroupAsync(token);
      updateCurrentGroup(joinedGroup);
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message);
    } finally {
      router.replace("/");
    }
  }

  if (!token) {
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
          <Text style={styles.buttonText}>Continue</Text>
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
      <Text style={styles.subtitle}>Do you want to join this group?</Text>
      <Button onPress={handleJoinGroup}>
        <Text style={styles.buttonText}>Join Group</Text>
      </Button>
      <Button onPress={() => router.replace("/")} variant="secondary">
        <Text style={styles.secondaryButtonText}>Cancel</Text>
      </Button>
      <LoadingOverlay visible={isPending} message="Joining group..." />
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
  buttonText: {
    color: GLOBAL_STYLES.colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: GLOBAL_STYLES.colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
