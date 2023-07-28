import { useRouteError } from "@remix-run/react";
import ErrorBox, { errorPageFromRouteError } from "~/components/ErrorBox";

export function ErrorBoundary() {
  return <ErrorBox {...errorPageFromRouteError(useRouteError())} />;
}
