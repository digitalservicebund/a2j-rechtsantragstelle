import { posthog } from "posthog-js";
import { config } from "../env/web";

export const initPosthog = (hasTrackingConsent?: boolean) => {
  const { POSTHOG_API_HOST, POSTHOG_API_KEY } = config();
  if (!POSTHOG_API_KEY || !POSTHOG_API_HOST || hasTrackingConsent === false)
    return;

  return posthog.init(POSTHOG_API_KEY, {
    api_host: POSTHOG_API_HOST,
    session_recording: {
      // Masking input and text elements to prevent sensitive data being shown on replays
      maskTextSelector: "*",
      maskAllInputs: true,
    },
    cross_subdomain_cookie: false, // set cookie for subdomain only
    opt_out_capturing_by_default: true,
    opt_out_persistence_by_default: true,
  });
};
