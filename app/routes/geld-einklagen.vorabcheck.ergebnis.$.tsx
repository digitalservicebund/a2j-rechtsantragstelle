import type { LoaderFunctionArgs } from "@remix-run/node";
import { loader as resultLoader } from "~/routes/shared/result.server";
import { throw404IfFeatureFlagDisabled } from "~/services/errorPages/throw404";

export { ResultPage as default } from "./shared/components/ResultPage";

export const loader = async (opts: LoaderFunctionArgs) => {
  await throw404IfFeatureFlagDisabled("showGeldEinklagenFlow");
  return await resultLoader(opts);
};
