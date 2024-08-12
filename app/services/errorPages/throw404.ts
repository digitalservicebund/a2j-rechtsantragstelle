import { config } from "~/services/env/web";
import { FeatureFlag, isFeatureFlagEnabled } from "~/services/featureFlags";

export const throw404OnProduction = () => {
  if (config().ENVIRONMENT === "production")
    throw new Response(null, { status: 404 });
};

export const throw404IfFeatureFlagEnabled = async (
  featureFlag: FeatureFlag,
) => {
  if (!(await isFeatureFlagEnabled(featureFlag))) {
    throw new Response(null, { status: 404 });
  }
};
