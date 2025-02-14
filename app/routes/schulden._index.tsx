import type { LoaderFunctionArgs } from "@remix-run/node";
import { loader as stepLoader } from "~/routes/$";

export { default } from "./$";

export const loader = async (opts: LoaderFunctionArgs) => {
  return await stepLoader(opts);
};
