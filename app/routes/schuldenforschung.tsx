import { LoaderFunction, redirect } from "@remix-run/node";

export const loader: LoaderFunction = async () =>
  redirect("https://app.formbricks.com/s/cm02c31ka0000102tqa05xr32");
