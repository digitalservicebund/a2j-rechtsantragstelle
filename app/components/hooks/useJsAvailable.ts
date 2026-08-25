import { useSyncExternalStore } from "react";

export function useJsAvailable() {
  return useSyncExternalStore(
    () => () => {},
    () => true, // true on client
    () => false, // false on server
  );
}
