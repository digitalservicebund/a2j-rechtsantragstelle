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
  if (isRouteErrorResponse(routeError)) {
    const status = routeError.status;

    if (ERROR_PAGES[status]) {
      return ERROR_PAGES[status];
    }
  }
  return ERROR_PAGES[500];
}

export function ErrorBox() {
  const routerError = useRouteError();
  const isProd = config().ENVIRONMENT === "production";
  const content = matchingError(routerError);

  return (
    <div className="flex flex-col grow">
      <ContentComponents content={content} />
      <Container>{!isProd && <pre>{jsError(routerError)}</pre>}</Container>
    </div>
  );
}
