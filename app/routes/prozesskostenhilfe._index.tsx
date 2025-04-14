import type { LoaderFunctionArgs } from "react-router";
import { loader as stepLoader } from "~/routes/$";

export { default } from "./$";

export const loader = async (opts: LoaderFunctionArgs) => {
  return await stepLoader(opts);
};
