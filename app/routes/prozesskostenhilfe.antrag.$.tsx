import { type LoaderFunctionArgs } from "@remix-run/node";
import { loader as stepLoader } from "~/routes/shared/formular.server";
import { throw404OnProduction } from "~/services/errorPages/throw404";
export { action } from "~/routes/shared/formular.server";
export { FormFlowPage as default } from "~/routes/shared/components/FormFlowPage";

export function loader(args: LoaderFunctionArgs) {
  throw404OnProduction();
  return stepLoader(args);
}
