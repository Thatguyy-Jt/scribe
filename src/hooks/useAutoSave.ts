import { useEffect, useRef, useState } from "react";

export function useAutoSave(
  callback: (title: string, content: any) => Promise<void>,
  delay: number = 2000
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);

  const scheduleSave = (title: string, content: any) => {
    setHasPendingChanges(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      await callback(title, content);
      setHasPendingChanges(false);
    }, delay);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { scheduleSave, hasPendingChanges };
}