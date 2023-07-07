import { useRouteError } from "@remix-run/react";
import ErrorBox from "~/components/ErrorBox";
import errorMessage from "~/util/errorMessage";

export function ErrorBoundary() {
  return <ErrorBox errorMessage={errorMessage(useRouteError())} />;
}
