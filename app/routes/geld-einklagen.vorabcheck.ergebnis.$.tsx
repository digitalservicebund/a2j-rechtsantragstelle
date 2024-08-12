import type { LoaderFunctionArgs } from "@remix-run/node";
import { loader as stepLoader } from "~/routes/shared/result.server";
import { throw404IfFeatureFlagEnabled } from "~/services/errorPages/throw404";

export { DefaultResultPage as default } from "../components/resultPage/DefaultResultPage";

export const loader = async (opts: LoaderFunctionArgs) => {
  await throw404IfFeatureFlagEnabled("showGeldEinklagenFlow");
  return await stepLoader(opts);
};
