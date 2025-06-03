import { type PostHog } from "posthog-js";
import { createContext, useContext } from "react";

export const AnalyticsContext = createContext<{
  posthogClient: PostHog | undefined;
  hasTrackingConsent: boolean | undefined; // hasTrackingConsent is undefined until the user responds to the cookie banner, and then will be true/false depending on the response
}>({
  posthogClient: undefined,
  hasTrackingConsent: undefined,
});

export const useAnalytics = () => useContext(AnalyticsContext);
