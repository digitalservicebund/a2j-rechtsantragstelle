import { type LoaderFunctionArgs } from "@remix-run/node";
import { throw404IfFeatureFlagEnabled } from "~/services/errorPages/throw404";
import { loader as lastStepLoader } from "~/services/flow/server/lastStep";
export { FormFlowPage as default } from "~/routes/shared/components/FormFlowPage";

export async function loader(args: LoaderFunctionArgs) {
  await throw404IfFeatureFlagEnabled("showProzesskostenhilfeFlow");
  return lastStepLoader(args);
}
