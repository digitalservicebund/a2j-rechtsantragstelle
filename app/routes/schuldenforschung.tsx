import { LoaderFunction, redirect } from "@remix-run/node";

export const loader: LoaderFunction = async () =>
  redirect("https://ec.europa.eu/eusurvey/runner/schuldenforschung");
