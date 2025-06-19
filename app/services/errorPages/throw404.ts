import { config } from "~/services/env/web";
import type { FeatureFlag } from "~/services/isFeatureFlagEnabled.server";
import { isFeatureFlagEnabled } from "~/services/isFeatureFlagEnabled.server";

export const throw404OnProduction = () => {
  if (config().ENVIRONMENT === "production")
    throw new Response(null, { status: 404 });
};

export const throw404IfFeatureFlagDisabled = async (
  featureFlag: FeatureFlag,
) => {
  const isPageEnabled = await isFeatureFlagEnabled(featureFlag);
  if (!isPageEnabled) {
    throw new Response(null, { status: 404 });
  }
};
