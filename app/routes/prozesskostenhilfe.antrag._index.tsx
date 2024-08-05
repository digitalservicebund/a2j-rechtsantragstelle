import { type LoaderFunctionArgs } from "@remix-run/node";
import { throw404OnProduction } from "~/services/errorPages/throw404";
import { loader as lastStepLoader } from "~/services/flow/server/lastStep";
export { FormFlowPage as default } from "~/routes/shared/components/FormFlowPage";

export function loader(args: LoaderFunctionArgs) {
  throw404OnProduction();
  return lastStepLoader(args);
}
