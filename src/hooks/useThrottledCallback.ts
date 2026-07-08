import { useCallback, useRef } from "react";

export function useThrottledCallback<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number = 500,
): T {
  const lastCallRef = useRef(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        callback(...args);
      }
    },
    [callback, delay],
  ) as T;
}
