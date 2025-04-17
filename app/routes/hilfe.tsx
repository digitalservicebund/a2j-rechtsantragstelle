import { type LoaderFunction, redirect } from "react-router";
//redirect to kontakt page
export const loader: LoaderFunction = () => redirect("/kontakt");
