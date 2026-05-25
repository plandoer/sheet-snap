import { useUser } from "@/context/UserContext";
import { ErrorInfo } from "@/models/errorInfo";
import { handleLogin } from "@/utils/authUtils";
import { getErrorInfo } from "@/utils/errorUtils";
import { useState } from "react";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUser();
  const [error, setError] = useState<ErrorInfo | null>(null);

  async function login() {
    setError(null);
    try {
      setIsLoading(true);
      const userInfo = await handleLogin();

      if (userInfo) {
        setUser(userInfo);
      }
    } catch (error: unknown) {
      const errorInfo = getErrorInfo(error);
      setError(errorInfo);
      console.error("Login failed:", error);
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
