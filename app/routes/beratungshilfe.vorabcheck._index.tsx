import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import beratungshilfeFlow from "~/models/flows/beratungshilfe/config.json";
import { getInitialStep } from "~/services/flow/getInitialStep";

export const loader: LoaderFunction = async () => {
  return redirect(getInitialStep({ flow: beratungshilfeFlow }).url);
};
