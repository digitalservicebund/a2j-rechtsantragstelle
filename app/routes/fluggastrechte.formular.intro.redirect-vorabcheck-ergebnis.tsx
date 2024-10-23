import { type LoaderFunction, redirect } from "@remix-run/node";
//workaround to redirect to the vorabcheck result
export const loader: LoaderFunction = async () =>
  redirect("/fluggastrechte/vorabcheck/ergebnis/erfolg");
