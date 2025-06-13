import { getPosthogNodeClient } from "~/services/analytics/posthogClient.server";
import { config } from "~/services/env/web";

const localFeatureFlags = {
  showGeldEinklagenFlow: true,
  showFileUpload: true,
  showKontopfaendungWegweiserFlow: true,
} as const;

export type FeatureFlag = keyof typeof localFeatureFlags;

const posthogDistinctId = "backend";

export const isFeatureFlagEnabled = async (featureFlag: FeatureFlag) =>
  config().ENVIRONMENT === "development"
    ? localFeatureFlags[featureFlag]
    : await getPosthogNodeClient()?.isFeatureEnabled(
        featureFlag,
        posthogDistinctId,
      );
