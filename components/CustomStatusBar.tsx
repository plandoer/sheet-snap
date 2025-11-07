import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function CustomStatusBar() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <StatusBar barStyle="dark-content" />
    </>
  );
}
