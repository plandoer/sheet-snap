import {
  focusManager,
  onlineManager,
  QueryClient,
} from "@tanstack/react-query";
import * as Network from "expo-network";
import { useEffect } from "react";
import type { AppStateStatus } from "react-native";
import { AppState, Platform } from "react-native";

export const queryClient = new QueryClient();

onlineManager.setEventListener((setOnline) => {
  let initialised = false;

  const eventSubscription = Network.addNetworkStateListener((state) => {
    initialised = true;
    setOnline(!!state.isConnected);
  });

  Network.getNetworkStateAsync()
    .then((state) => {
      if (!initialised) {
        setOnline(!!state.isConnected);
      }
    })
    .catch((error) => {
      console.error("Failed to get network state:", error);
    });

  return eventSubscription.remove;
});

export function useAppFocusManager() {
  useEffect(() => {
    function onAppStateChange(status: AppStateStatus) {
      if (Platform.OS !== "web") {
        focusManager.setFocused(status === "active");
      }
    }

    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, []);
}
