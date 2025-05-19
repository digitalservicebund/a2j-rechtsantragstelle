import { usePostHog } from "posthog-js/react";
import { useContext, useEffect } from "react";
import { CookieConsentContext } from "./CookieConsentContext";

/**
 * @description
 * Hook that returns the posthog client and a boolean indicating whether there is tracking consent.
 * When the consent status changes, it will opt in or out of capturing events with posthog.
 * @returns
 * An object with the posthog client and a boolean indicating whether there is tracking consent.
 * @example
 * const { posthog, hasTrackingConsent } = usePosthogWithConsent();
 * if (posthog && hasTrackingConsent) {
 *   posthog.capture('Page viewed', { url: window.location.href });
 * }
 */
export function usePosthogWithConsent() {
  const hasTrackingConsent = useContext(CookieConsentContext);
  const posthog = usePostHog();

  useEffect(() => {
    if (posthog) {
      if (hasTrackingConsent) {
        posthog.opt_in_capturing();
      } else if (hasTrackingConsent === false) {
        posthog.opt_out_capturing();
      }
    }
  }, [posthog, hasTrackingConsent]);
  return {
    posthog,
    hasTrackingConsent,
  };
}
