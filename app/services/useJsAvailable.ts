import { useState, useEffect } from "react";

export function useJsAvailable() {
  const [isJsAvailable, setIsJsAvailable] = useState(false);
  useEffect(() => setIsJsAvailable(true), []);
  return isJsAvailable;
}
