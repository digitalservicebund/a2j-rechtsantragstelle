import type { LoaderFunctionArgs } from "@remix-run/node";
import { loader as voarbcheckLoader } from "~/routes/shared/vorabcheck.server";
import { throw404IfFeatureFlagEnabled } from "~/services/errorPages/throw404";

export { action } from "~/routes/shared/vorabcheck.server";
export { VorabcheckPage as default } from "~/routes/shared/components/VorabcheckPage";

export const loader = async (opts: LoaderFunctionArgs) => {
  await throw404IfFeatureFlagEnabled("showGeldEinklagenFlow");
  return await voarbcheckLoader(opts);
};
