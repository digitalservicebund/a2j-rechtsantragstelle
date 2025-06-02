import { type PostHog } from "posthog-js";
import { createContext, useContext } from "react";

export const AnalyticsContext = createContext<{
  posthogClient: PostHog | undefined;
  hasTrackingConsent: boolean | undefined;
}>({
  posthogClient: undefined,
  hasTrackingConsent: undefined,
});

export const useAnalytics = () => useContext(AnalyticsContext);
