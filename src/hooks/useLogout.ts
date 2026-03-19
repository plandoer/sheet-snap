import { signOutFromGoogle } from "@/config/google-signin";
import { useSheet } from "@/context/SheetContext";
import { useUser } from "@/context/UserContext";

export function useLogout() {
  const { setUser } = useUser();
  const { setSelectedSheet } = useSheet();

  async function logout() {
    try {
      await signOutFromGoogle();
    } catch (error) {
      console.error("Sign-out error:", error);
    } finally {
      setUser(null);
      setSelectedSheet(null);
    }
  }

  return { logout };
}
