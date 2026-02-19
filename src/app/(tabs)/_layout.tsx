import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Quick Add" }} />
      <Tabs.Screen name="expenses" options={{ title: "Expenses" }} />
    </Tabs>
  );
}
