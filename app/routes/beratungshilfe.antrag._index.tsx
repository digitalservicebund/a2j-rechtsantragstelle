import { type LoaderFunctionArgs } from "@remix-run/node";
import { throw404OnProduction } from "~/services/errorPages/throw404";
import { loader as lastStepLoader } from "~/services/flow/lastStep";

export function loader(args: LoaderFunctionArgs) {
  throw404OnProduction();
  return lastStepLoader(args);
}
