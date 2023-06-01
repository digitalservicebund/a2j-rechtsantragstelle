import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getInitialStep } from "~/services/flow";

export const loader: LoaderFunction = async () => {
  return redirect(`/vorabcheck/${getInitialStep()}`);
};
