import type { LoaderFunctionArgs } from "@remix-run/node";
import { loader as stepLoader } from "~/routes/index-context";
import { throw404IfFeatureFlagDisabled } from "~/services/errorPages/throw404";

export { default } from "./index-context";

export const loader = async (opts: LoaderFunctionArgs) => {
  await throw404IfFeatureFlagDisabled("showProzesskostenhilfeFlow");
  return await stepLoader(opts);
};
