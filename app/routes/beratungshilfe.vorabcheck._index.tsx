import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getStepUrl, initialStep } from "~/services/flow";

export const loader: LoaderFunction = async () => {
  return redirect(getStepUrl(initialStep));
};
