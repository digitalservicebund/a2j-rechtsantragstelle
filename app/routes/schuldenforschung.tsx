import { type LoaderFunction, redirect } from "react-router";

export const loader: LoaderFunction = () => redirect("/feedback-studien");
