import { useEffect } from "react";
import { useLocation } from "react-router";
import { usePosthogWithConsent } from "./usePosthogWithConsent";

export function usePageViewTracker() {
  const { posthog, hasTrackingConsent } = usePosthogWithConsent();
  const location = useLocation();

  useEffect(() => {
    if (posthog && hasTrackingConsent) {
      posthog.capture("$pageview");
    }
  }, [posthog, hasTrackingConsent, location.pathname]);
  return null;
}
