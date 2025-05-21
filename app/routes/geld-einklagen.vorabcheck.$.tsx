import type { LoaderFunctionArgs } from "react-router";
import { loader as voarbcheckLoader } from "~/routes/shared/vorabcheck.server";
import { throw404IfFeatureFlagDisabled } from "~/services/errorPages/throw404";

export { action } from "~/routes/shared/vorabcheck.server";
export { VorabcheckPage as default } from "~/routes/shared/components/VorabcheckPage";

export const loader = async (opts: LoaderFunctionArgs) => {
  await throw404IfFeatureFlagDisabled("showGeldEinklagenFlow");
  return await voarbcheckLoader(opts);
};
