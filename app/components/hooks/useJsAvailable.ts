import { useState, useEffect } from "react";

export function useJsAvailable() {
  const [isJsAvailable, setIsJsAvailable] = useState(false);
  // oxlint-disable-next-line react/set-state-in-effect
  useEffect(() => setIsJsAvailable(true), []);
  return isJsAvailable;
}
