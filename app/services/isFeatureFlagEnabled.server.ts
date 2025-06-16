import { getPosthogNodeClient } from "~/services/analytics/posthogClient.server";
import { config } from "./env/env.server";

// Note: This flags can be enabled locally using the USE_LOCAL_FEATURE_FLAGS env variable
// These settings here are also used for e2e tests and therefore should match production as closely as possible
const localFeatureFlags = {
  showGeldEinklagenFlow: false,
  showFileUpload: false,
  showKontopfaendungWegweiserFlow: false,
} as const;

export type FeatureFlag = keyof typeof localFeatureFlags;

const posthogDistinctId = "backend";

export const isFeatureFlagEnabled = async (featureFlag: FeatureFlag) =>
  config().USE_LOCAL_FEATURE_FLAGS
    ? localFeatureFlags[featureFlag]
    : await getPosthogNodeClient()?.isFeatureEnabled(
        featureFlag,
        posthogDistinctId,
      );
