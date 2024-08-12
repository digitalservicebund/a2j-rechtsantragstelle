import type { LoaderFunctionArgs } from "@remix-run/node";
import { loader as stepLoader } from "~/routes/$";
import { throw404IfFeatureFlagEnabled } from "~/services/errorPages/throw404";

export { default } from "./beratungshilfe";

export const loader = async (opts: LoaderFunctionArgs) => {
  await throw404IfFeatureFlagEnabled("showGeldEinklagenFlow");
  return await stepLoader(opts);
};
