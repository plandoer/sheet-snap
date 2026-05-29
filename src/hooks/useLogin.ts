import { useUser } from "@/context/UserContext";
import { handleLogin } from "@/utils/authUtils";
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

  return {
    isLoading,
    login,
  };
}
