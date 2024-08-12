import type { LoaderFunctionArgs } from "@remix-run/node";
import { loader as formularLoader } from "~/routes/shared/formular.server";
import { throw404IfFeatureFlagEnabled } from "~/services/errorPages/throw404";

export { action } from "~/routes/shared/formular.server";
export { FormFlowPage as default } from "~/routes/shared/components/FormFlowPage";

export const loader = async (opts: LoaderFunctionArgs) => {
  await throw404IfFeatureFlagEnabled("showGeldEinklagenFlow");
  return await formularLoader(opts);
};
