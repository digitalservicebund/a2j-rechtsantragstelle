import { type LoaderFunctionArgs } from "@remix-run/node";
import { throw404IfFeatureFlagDisabled } from "~/services/errorPages/throw404";
import { loader as lastStepLoader } from "~/services/flow/server/lastStep";
export { FormFlowPage as default } from "~/routes/shared/components/FormFlowPage";

export async function loader(args: LoaderFunctionArgs) {
  await throw404IfFeatureFlagDisabled("showProzesskostenhilfeFlow");
  return lastStepLoader(args);
}
