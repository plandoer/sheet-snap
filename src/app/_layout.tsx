import { initGoogleSignIn } from "@/config/google-signin";
import { SheetProvider } from "@/context/SheetContext";
import { UserProvider, useUser } from "@/context/UserContext";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

function NavigationContainer() {
  const { isUserLoggedIn, isLoading } = useUser();

  if (!isLoading) {
    SplashScreen.hideAsync();
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={isUserLoggedIn}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
        <Stack.Protected guard={!isUserLoggedIn}>
          <Stack.Screen name="sign-in" />
        </Stack.Protected>
      </Stack>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  useEffect(() => {
    initGoogleSignIn();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <UserProvider>
        <SheetProvider>
          <NavigationContainer />
        </SheetProvider>
      </UserProvider>
    </SafeAreaProvider>
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
