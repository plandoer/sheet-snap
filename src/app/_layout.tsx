import { GLOBAL_STYLES } from "@/constants/global-styles";
import { SheetProvider } from "@/context/SheetContext";
import { UserProvider, useUser } from "@/context/UserContext";
import { initGoogleSignIn } from "@/services/googleAuthService";
import { initCurrentUser } from "@/utils/authUtils";
import { getErrorInfo } from "@/utils/errorUtils";
import { queryClient, useAppFocusManager } from "@/utils/queryUtils";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClientProvider } from "@tanstack/react-query";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const [isReady, setIsReady] = useState(false);
  const { setUser, user } = useUser();
  const router = useRouter();

  // Manage app focus for tanstack query to pause queries when app is in background
  useAppFocusManager();

  // Do initialization work on app load
  useEffect(() => {
    async function doInitialization() {
      try {
        initGoogleSignIn();

        const currentUser = await initCurrentUser();

        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        const errorInfo = getErrorInfo(error);
        Alert.alert(errorInfo.title, errorInfo.message);
        console.error("Error during initialization:", error);
      } finally {
        setIsReady(true);
      }
    }
    doInitialization();
  }, [setUser, router]);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
      if (!user) {
        router.replace("/(auth)/sign-in");
      }
    }
  }, [isReady, user, router]);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={GLOBAL_STYLES.colors.primary} />
        <Text style={styles.loadingTitle}>Setting things up...</Text>
        <Text style={styles.loadingSubtitle}>
          Checking your account and preparing your sheets.
        </Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="expense-details" />
      </Stack.Protected>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)/sign-in" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <StatusBar barStyle="dark-content" />
          <QueryClientProvider client={queryClient}>
            <UserProvider>
              <SheetProvider>
                <SafeAreaView style={styles.container}>
                  <RootNavigator />
                </SafeAreaView>
              </SheetProvider>
            </UserProvider>
          </QueryClientProvider>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  loadingTitle: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: "600",
    color: GLOBAL_STYLES.colors.textPrimary,
  },
  loadingSubtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: GLOBAL_STYLES.colors.textSecondary,
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: GLOBAL_STYLES.colors.backgroundColor,
  },
});
