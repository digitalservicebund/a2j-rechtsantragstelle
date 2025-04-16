import { type LoaderFunction, redirect } from "@remix-run/node";
//redirect to kontakt page
export const loader: LoaderFunction = () => redirect("/kontakt");
