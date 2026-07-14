import { useCallback, useRef } from "react";

export function useThrottledCallback(
  callback: () => void,
  delay: number = 500,
) {
  const lastCallRef = useRef(0);

  return useCallback(() => {
    const now = Date.now();
    if (now - lastCallRef.current >= delay) {
      lastCallRef.current = now;
      callback();
    }
  }, [callback, delay]);
}
