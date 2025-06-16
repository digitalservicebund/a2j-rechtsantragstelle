import type { PostHog } from "posthog-js";

export const AB_PATHNAME = "/prozesskostenhilfe/formular/start/start";
export const AP_EXPERIMENT_GROUP = "test";

export const shouldShowEstimatedTime = (
  pathname: string,
  posthogClient?: PostHog,
) =>
  pathname === AB_PATHNAME &&
  posthogClient?.getFeatureFlag("conversion-rate-pkh-flow") ===
    AP_EXPERIMENT_GROUP;
