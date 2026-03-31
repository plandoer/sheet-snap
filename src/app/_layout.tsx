import { SheetProvider } from "@/context/SheetContext";
import { UserProvider, useUser } from "@/context/UserContext";
import { initGoogleSignIn } from "@/services/googleAuthService";
import { getCurrentUser } from "@/utils/authUtils";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const [isReady, setIsReady] = useState(false);
  const { setUser, user } = useUser();

  // Do initialization work on app load
  useEffect(() => {
    async function doInitialization() {
      try {
        initGoogleSignIn();
        const currentUser = await getCurrentUser();

        console.log("Initialization complete. Current user:", currentUser);
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }
    doInitialization();
  }, [setUser]);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
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
          <UserProvider>
            <SheetProvider>
              <SafeAreaView style={styles.container}>
                <RootNavigator />
              </SafeAreaView>
            </SheetProvider>
          </UserProvider>
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
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
