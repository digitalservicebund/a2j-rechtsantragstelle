import { usePostHog } from "posthog-js/react";
import { useContext, useEffect } from "react";
import { CookieConsentContext } from "./CookieConsentContext";
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
