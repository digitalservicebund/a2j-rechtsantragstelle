import { getPosthogClient } from "~/services/analytics/posthogClient.server";
import { config } from "~/services/env/web";

export type FeatureFlag =
  | "showFluggastrechteFormular"
  | "showGeldEinklagenFlow"
  | "showProzesskostenhilfeFlow"
  | "showERV"
  | "showBundID"
  | "showFileUpload"
  | "showKontopfaendungWegweiserFlow";

export const isFeatureFlagEnabled = async (featureFlag: FeatureFlag) => {
  const posthogDistinctId = "backend";
  if (config().ENVIRONMENT !== "production") return true;
  return await getPosthogClient()?.isFeatureEnabled(
    featureFlag,
    posthogDistinctId,
  );
};
