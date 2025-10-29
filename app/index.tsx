import Login from "@/components/Login";
import { initGoogleSignIn } from "@/config/google-signin";
import { useUser } from "@/context/UserContext";
import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StatusBar, StyleSheet, View } from "react-native";

export default function Index() {
  const { user, isLoading } = useUser();

  useEffect(() => {
    initGoogleSignIn();
  }, []);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/home");
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#34A853" />
        </View>
      </>
    );
  }

  return <Login />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
});
