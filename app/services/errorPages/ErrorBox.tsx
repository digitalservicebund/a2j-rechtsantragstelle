import { isRouteErrorResponse, useRouteError } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import Container from "~/components/layout/Container";
import { config } from "~/services/env/public";
import { ERROR_PAGES } from "./errorPages";

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

export function ErrorBox() {
  const routerError = useRouteError();
  const isProd = config().ENVIRONMENT === "production";
  return (
    <div className="flex flex-col grow">
      <ContentComponents content={matchingError(routerError)} />
      <Container>{!isProd && <pre>{jsError(routerError)}</pre>}</Container>
    </div>
  );
}
