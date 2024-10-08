import type { LoaderFunctionArgs } from "@remix-run/node";
import { throw404IfFeatureFlagDisabled } from "~/services/errorPages/throw404";
import { loader as stepLoader } from "./$";

export { default } from "./$";

export const loader = async (opts: LoaderFunctionArgs) => {
  await throw404IfFeatureFlagDisabled("showGeldEinklagenFlow");
  return await stepLoader(opts);
};
