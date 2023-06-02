import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { initialStep } from "~/services/flow";

export const loader: LoaderFunction = async () => {
  return redirect(`/vorabcheck/${initialStep}`);
};
