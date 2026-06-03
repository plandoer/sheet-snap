import { useUser } from "@/context/UserContext";
import { handleLogin, handleLogout } from "@/utils/authUtils";
import { useState } from "react";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUser();

  async function login(): Promise<void> {
    try {
      setIsLoading(true);
      const userInfo = await handleLogin();

      if (userInfo) {
        setUser(userInfo);
      }
    } catch (error: unknown) {
      console.error("Login failed:", error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function logout(): Promise<void> {
    try {
      setIsLoading(true);
      setUser(null);
      await handleLogout();
    } catch (error: unknown) {
      console.error("Logout failed:", error);
      return;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    login,
    logout,
  };
}
