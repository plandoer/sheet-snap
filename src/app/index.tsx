import CustomStatusBar from "@/components/CustomStatusBar";
import Login from "@/components/Login";
import { initGoogleSignIn } from "@/config/google-signin";
import { useUser } from "@/context/UserContext";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

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
        <CustomStatusBar />
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
