import { useUser } from "@/context/UserContext";
import { ErrorInfo } from "@/models/errorInfo";
import { handleLogin } from "@/utils/authUtils";
import { getErrorInfo } from "@/utils/errorUtils";
import { useState } from "react";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUser();
  const [error, setError] = useState<ErrorInfo | null>(null);

  async function login(): Promise<void> {
    setError(null);
    try {
      setIsLoading(true);
      const userInfo = await handleLogin();

      if (userInfo) {
        setUser(userInfo);
      }
    } catch (error: unknown) {
      console.error("Login failed:", error);
      const errorInfo = getErrorInfo(error);
      setError(errorInfo);
      return Promise.reject();
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    error,
    login,
  };
}
