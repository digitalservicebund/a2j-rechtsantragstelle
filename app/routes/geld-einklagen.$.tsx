import type { LoaderFunctionArgs } from "@remix-run/node";
import { throw404IfFeatureFlagEnabled } from "~/services/errorPages/throw404";
import { loader as stepLoader } from "./$";

export { default } from "./$";

export const loader = async (opts: LoaderFunctionArgs) => {
  await throw404IfFeatureFlagEnabled("showGeldEinklagenFlow");
  return await stepLoader(opts);
};
