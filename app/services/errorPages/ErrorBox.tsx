import type { AppLoadContext } from "react-router";
import { isRouteErrorResponse, useRouteError } from "react-router";
import Container from "~/components/Container";
import { config } from "~/services/env/public";
import { ERROR_PAGES } from "./errorPages";
import PageContent from "../../components/PageContent";

function jsError(routeError: unknown) {
  if (typeof routeError === "string") return routeError.toUpperCase();
  if (routeError instanceof Error) return routeError.message;
}

function matchingError(routeError: unknown) {
  if (isRouteErrorResponse(routeError) && ERROR_PAGES[routeError.status]) {
    return ERROR_PAGES[routeError.status];
  }
  return ERROR_PAGES[500];
}

type ErrorBoxProps = {
  readonly context: AppLoadContext;
};

export function ErrorBox({ context }: ErrorBoxProps) {
  const routerError = useRouteError();
  const debugId = context.debugId as string | undefined;
  const isProd = config().ENVIRONMENT === "production";
  return (
    <div className="flex flex-col flex-grow">
      <PageContent content={matchingError(routerError)} />
      <Container>
        {debugId && <pre>ID: {debugId}</pre>}
        {!isProd && <pre>{jsError(routerError)}</pre>}
      </Container>
    </div>
  );
}
