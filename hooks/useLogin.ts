import { useUser } from "@/context/UserContext";
import { handleGoogleLogin } from "@/utils/loginUtils";
import { useState } from "react";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUser();

  async function login() {
    setIsLoading(true);
    const userInfo = await handleGoogleLogin();

    if (userInfo) {
      setUser(userInfo);
    }
    setIsLoading(false);
    return userInfo;
  }

  return {
    isLoading,
    login,
  };
}
