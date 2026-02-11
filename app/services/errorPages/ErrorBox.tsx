import { isRouteErrorResponse, useRouteError } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import Container from "~/components/layout/Container";
import { config } from "~/services/env/public";
import { ERROR_PAGES } from "./errorPages";

function jsError(routeError: unknown) {
  if (typeof routeError === "string") return routeError.toUpperCase();
  if (routeError instanceof Error) return routeError.message;
}

function matchingError(routeError: unknown, showKernUX: boolean) {
  if (isRouteErrorResponse(routeError)) {
    const status = routeError.status;

    if (showKernUX && ERROR_PAGES[`${status}_kern`]) {
      return ERROR_PAGES[`${status}_kern`];
    }

    if (ERROR_PAGES[status]) {
      return ERROR_PAGES[status];
    }
  }

  if (showKernUX && ERROR_PAGES["500_kern"]) {
    return ERROR_PAGES["500_kern"];
  }

  return ERROR_PAGES[500];
}

export function ErrorBox({ showKernUX = false }: { showKernUX?: boolean }) {
  const routerError = useRouteError();
  const isProd = config().ENVIRONMENT === "production";
  const content = matchingError(routerError, showKernUX);

  if (showKernUX) {
    return (
      <div className="flex flex-col py-kern-space-x-large">
        <ContentComponents content={content} showKernUX />
        <div>{!isProd && <pre>{jsError(routerError)}</pre>}</div>
      </div>
    );
  }
  return (
    <div className="flex flex-col grow">
      <ContentComponents content={content} />
      <Container>{!isProd && <pre>{jsError(routerError)}</pre>}</Container>
    </div>
  );
}
