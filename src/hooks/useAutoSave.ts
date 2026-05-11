import { useEffect, useRef, useState, useCallback } from "react";

export function useAutoSave(
  callback: (title: string, content: any) => Promise<void>,
  delay: number = 2000
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const callbackRef = useRef(callback);
  const pendingRef = useRef<{ title: string; content: any } | null>(null);

  callbackRef.current = callback;

  const scheduleSave = useCallback((title: string, content: any) => {
    setHasPendingChanges(true);
    pendingRef.current = { title, content };

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      pendingRef.current = null;
      await callbackRef.current(title, content);
      setHasPendingChanges(false);
    }, delay);
  }, [delay]);

  // Flush pending save on unmount so changes aren't lost
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (pendingRef.current) {
        const { title, content } = pendingRef.current;
        callbackRef.current(title, content);
      }
    };
  }, []);

  return { scheduleSave, hasPendingChanges };
}