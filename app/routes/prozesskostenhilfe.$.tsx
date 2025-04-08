import type { LoaderFunctionArgs } from "react-router";
import { loader as stepLoader } from "~/routes/$";
import { throw404IfFeatureFlagDisabled } from "~/services/errorPages/throw404";

export { default } from "./$";

export const loader = async (opts: LoaderFunctionArgs) => {
  await throw404IfFeatureFlagDisabled("showProzesskostenhilfeFlow");
  return await stepLoader(opts);
};
