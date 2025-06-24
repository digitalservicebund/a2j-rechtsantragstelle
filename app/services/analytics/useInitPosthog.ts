import { posthog, type PostHog } from "posthog-js";
import { useEffect, useState } from "react";
import { POSTHOG_API_HOST } from "./config";
import { config } from "../env/public";

export const useInitPosthog = (hasTrackingConsent?: boolean) => {
  const [posthogClient, setPosthogClient] = useState<PostHog | undefined>();
  const { POSTHOG_API_KEY } = config();

  useEffect(() => {
    if (!POSTHOG_API_KEY || !hasTrackingConsent) return;

    posthog.init(POSTHOG_API_KEY, {
      api_host: POSTHOG_API_HOST,
      session_recording: {
        // Masking input and text elements to prevent sensitive data being shown on replays
        maskTextSelector: "*",
        maskAllInputs: true,
      },
      cross_subdomain_cookie: false, // set cookie for subdomain only
      opt_out_capturing_by_default: true,
      opt_out_persistence_by_default: true,
      secure_cookie: true,
      loaded: () => setPosthogClient(posthog),
    });
  }, [POSTHOG_API_KEY, hasTrackingConsent]);

  return posthogClient;
};
