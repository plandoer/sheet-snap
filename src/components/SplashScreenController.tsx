import { initGoogleSignIn } from "@/config/google-signin";
import { useUser } from "@/context/UserContext";
import { SplashScreen } from "expo-router";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

export default function SplashScreenController() {
  const [isReady, setIsReady] = useState(false);
  const { initUser, user } = useUser();

  useEffect(() => {
    async function doInitialization() {
      try {
        initGoogleSignIn();
        await initUser();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }
    doInitialization();
  }, [initUser]);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  return null;
}
