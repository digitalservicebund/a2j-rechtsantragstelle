import { type LoaderFunctionArgs } from "@remix-run/node";
import { loader as stepLoader } from "~/routes/shared/antrag.server";
import { throw404OnProduction } from "~/services/errorPages/throw404";
export { action } from "~/routes/shared/antrag.server";
export { AntragPage as default } from "~/routes/shared/components/AntragPage";

export function loader(args: LoaderFunctionArgs) {
  throw404OnProduction();
  return stepLoader(args);
}
