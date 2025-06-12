import { getPosthogNodeClient } from "~/services/analytics/posthogClient.server";

export type FeatureFlag =
  | "showGeldEinklagenFlow"
  | "showFileUpload"
  | "showKontopfaendungWegweiserFlow";

const posthogDistinctId = "backend";

export const isFeatureFlagEnabled = async (featureFlag: FeatureFlag) =>
  await getPosthogNodeClient()?.isFeatureEnabled(
    featureFlag,
    posthogDistinctId,
  );
