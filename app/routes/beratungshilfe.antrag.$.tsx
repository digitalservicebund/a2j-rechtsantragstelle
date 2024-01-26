import { type LoaderFunctionArgs } from "@remix-run/node";
import { loader as stepLoader } from "~/routes/shared/step.server";
import { throw404OnProduction } from "~/services/errorPages/throw404";
export { action } from "~/routes/shared/step.server";
export { StepWithPreHeading as default } from "~/routes/shared/components/StepWithPreHeading";

export function loader(args: LoaderFunctionArgs) {
  throw404OnProduction();
  return stepLoader(args);
}
