import { getPosthogNodeClient } from "~/services/analytics/posthogClient.server";

// These settings are used if posthog isn't available, including for e2e tests. They should match production as closely as possible
const localFeatureFlags = {
  showBundID: false,
  showGeldEinklagenFlow: true,
  showFileUpload: false,
  showKernUX: false,
  showFGROnlineVerfahren: true,
} as const;

export type FeatureFlag = keyof typeof localFeatureFlags;

// Potentially temporary for sharing feature flag state across the backend
type GlobalFeatureFlags = Record<FeatureFlag, boolean>;
export const globalFeatureFlags: GlobalFeatureFlags = { ...localFeatureFlags };

const posthogDistinctId = "backend";

export const isFeatureFlagEnabled = async (featureFlag: FeatureFlag) =>
  getPosthogNodeClient() === undefined
    ? localFeatureFlags[featureFlag]
    : await getPosthogNodeClient()?.isFeatureEnabled(
        featureFlag,
        posthogDistinctId,
      );
