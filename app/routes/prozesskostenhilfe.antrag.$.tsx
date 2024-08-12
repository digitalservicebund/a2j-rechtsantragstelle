import { type LoaderFunctionArgs } from "@remix-run/node";
import { loader as stepLoader } from "~/routes/shared/formular.server";
import { throw404IfFeatureFlagEnabled } from "~/services/errorPages/throw404";
export { action } from "~/routes/shared/formular.server";
export { FormFlowPage as default } from "~/routes/shared/components/FormFlowPage";

export async function loader(args: LoaderFunctionArgs) {
  await throw404IfFeatureFlagEnabled("showProzesskostenhilfeFlow");
  return stepLoader(args);
}
