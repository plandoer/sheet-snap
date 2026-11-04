import { useGroupContext } from "@/context/GroupContext";
import { useUser } from "@/context/UserContext";
import { handleLogin, handleLogout } from "@/utils/authUtils";
import { useCallback, useState } from "react";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUser();
  const { resetCurrentGroup } = useGroupContext();

  async function login(): Promise<void> {
    try {
      setIsLoading(true);
      const userInfo = await handleLogin();
      setUser(userInfo);
    } catch (error: unknown) {
      console.error("Login failed:", error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  }

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setUser(null);
      await resetCurrentGroup();
      await handleLogout();
    } catch (error: unknown) {
      console.error("Logout failed:", error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  }, [setUser, resetCurrentGroup]);

  return {
    isLoading,
    login,
    logout,
  };
}
