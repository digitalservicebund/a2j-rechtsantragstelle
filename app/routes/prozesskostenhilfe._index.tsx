import type { LoaderFunctionArgs } from "@remix-run/node";
import { loader as stepLoader } from "~/routes/index-context";

export { default } from "./index-context";

export const loader = async (opts: LoaderFunctionArgs) => {
  return await stepLoader(opts);
};
