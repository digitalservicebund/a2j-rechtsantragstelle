import { isRouteErrorResponse, useRouteError } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import { config } from "~/services/env/public";
import { ERROR_PAGES } from "./errorPages";
import { GridSection } from "~/components/layout/grid/GridSection";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";

function jsError(routeError: unknown) {
  if (typeof routeError === "string") return routeError.toUpperCase();
  if (routeError instanceof Error) return routeError.message;
}

function matchingError(routeError: unknown) {
  if (isRouteErrorResponse(routeError)) {
    const status = routeError.status;

    if (ERROR_PAGES[`${status}_kern`]) {
      return ERROR_PAGES[`${status}_kern`];
    }

    if (ERROR_PAGES[status]) {
      return ERROR_PAGES[status];
    }
  }

  if (ERROR_PAGES["500_kern"]) {
    return ERROR_PAGES["500_kern"];
  }

  return ERROR_PAGES[500];
}

export function ErrorBox() {
  const routerError = useRouteError();
  const isProd = config().ENVIRONMENT === "production";
  const content = matchingError(routerError);

  return (
    <div className="flex flex-col py-kern-space-x-large">
      <ContentComponents content={content} />
      <GridSection>
        <Grid>
          <GridItem
            mdColumn={{ start: 1, span: 8 }}
            lgColumn={{ start: 3, span: 9 }}
            xlColumn={{ start: 3, span: 9 }}
          >
            <div>
              {!isProd && (
                <pre className="whitespace-break-spaces">
                  {jsError(routerError)}
                </pre>
              )}
            </div>
          </GridItem>
        </Grid>
      </GridSection>
    </div>
  );
}
