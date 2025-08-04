import { getPosthogNodeClient } from "~/services/analytics/posthogClient.server";

// These settings are used if posthog isn't available, including for e2e tests. They should match production as closely as possible
const localFeatureFlags = {
  showGeldEinklagenFlow: false,
  showFileUpload: false,
  showNachbefragung: false,
  showPKHZusammenfassung: false,
} as const;

export type FeatureFlag = keyof typeof localFeatureFlags;

const posthogDistinctId = "backend";

export const isFeatureFlagEnabled = async (featureFlag: FeatureFlag) =>
  getPosthogNodeClient() === undefined
    ? localFeatureFlags[featureFlag]
    : await getPosthogNodeClient()?.isFeatureEnabled(
        featureFlag,
        posthogDistinctId,
      );
