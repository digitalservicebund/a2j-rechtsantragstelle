import { PostHog } from "posthog-node";
import { config } from "~/services/env/web";

export type FeatureFlag =
  | "showFluggastrechteFormular"
  | "showGeldEinklagenFlow"
  | "showProzesskostenhilfeFlow"
  | "showERV"
  | "showKopfzeile"
  | "showBundID"
  | "showFileUpload";

export const isFeatureFlagEnabled = async (featureFlag: FeatureFlag) => {
  const { POSTHOG_API_KEY, POSTHOG_API_HOST } = config();
  const posthogDistinctId = "backend";
  if (config().ENVIRONMENT !== "production") return true;
  if (POSTHOG_API_KEY) {
    const client = new PostHog(POSTHOG_API_KEY, { host: POSTHOG_API_HOST });
    return await client.isFeatureEnabled(featureFlag, posthogDistinctId);
  }
};
