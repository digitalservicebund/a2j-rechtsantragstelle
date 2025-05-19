import { useEffect } from "react";
import { useLocation } from "react-router";
import { usePosthogWithConsent } from "./usePosthogWithConsent";

/**
 * @description
 * Hook that tracks page views using PostHog when tracking consent is granted.
 * It automatically captures a "$pageview" event whenever the pathname changes.
 *
 * @returns
 * null
 */

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
