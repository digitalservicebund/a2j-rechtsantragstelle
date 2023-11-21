import { type LoaderFunctionArgs } from "@remix-run/node";
import { loader as stepLoader } from "~/routes/shared/step";
import { throw404OnProduction } from "~/services/errorPages/throw404";
export { action, StepWithPreHeading as default } from "~/routes/shared/step";

export function loader(args: LoaderFunctionArgs) {
  throw404OnProduction();
  return stepLoader(args);
}
