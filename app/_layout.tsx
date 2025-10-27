import { SheetProvider } from "@/context/SheetContext";
import { UserProvider } from "@/context/UserContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <UserProvider>
      <SheetProvider>
        <Stack />
      </SheetProvider>
    </UserProvider>
  );
}
