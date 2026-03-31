import { useUser } from "@/context/UserContext";
import { handleLogin } from "@/utils/authUtils";
import { useState } from "react";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUser();

  async function login() {
    setIsLoading(true);
    const userInfo = await handleLogin();

    if (userInfo) {
      setUser(userInfo);
    }
    setIsLoading(false);
  }

  return {
    isLoading,
    login,
  };
}
