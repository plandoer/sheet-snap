import { SheetProvider } from "@/context/SheetContext";
import { UserProvider } from "@/context/UserContext";
import { Stack } from "expo-router";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <UserProvider>
        <SheetProvider>
          <SafeAreaView style={styles.container}>
            <Stack screenOptions={{ headerShown: false }} />
          </SafeAreaView>
        </SheetProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
