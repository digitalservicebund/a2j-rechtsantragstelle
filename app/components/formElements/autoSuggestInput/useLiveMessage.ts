import { useState, useRef } from "react";

export const DEFAULT_ANNOUNCE_DELAY_MS = 100;
/**
 * This hook provides a way to set a message that will be announced via an ARIA live region.
 *  1. Clear any pending timeout to avoid overlapping announcements.
 *  2. Reset the live region to an empty string and bump the key so assistive tech
 *     detects a change even if the same message is announced repeatedly.
 *  3. After a short delay, set the requested message into the live region.
 */

export default function useLiveMessage() {
  const [liveMessage, setLiveMessage] = useState("");
  const [liveMessageKey, setLiveMessageKey] = useState(0);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const announceLiveMessage = (
    message: string,
    delay = DEFAULT_ANNOUNCE_DELAY_MS,
  ) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setLiveMessage("");
    setLiveMessageKey((key) => key + 1);

    timeoutRef.current = setTimeout(() => {
      setLiveMessage(message);
      timeoutRef.current = null;
    }, delay);
  };

  return { liveMessage, liveMessageKey, announceLiveMessage };
}
