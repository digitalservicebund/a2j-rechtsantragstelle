import { type LoaderFunction, redirect } from "react-router";
//workaround to redirect to the vorabcheck result
export const loader: LoaderFunction = () =>
  redirect("/fluggastrechte/vorabcheck/ergebnis/erfolg");
