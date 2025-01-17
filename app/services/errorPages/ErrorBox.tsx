import type { AppLoadContext } from "@remix-run/node";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import Container from "~/components/Container";
import { config } from "~/services/env/web";
import fallbackStrapiInfoBox from "./fallbackInfobox";
import PageContent from "../../components/PageContent";
import type { StrapiContentComponent } from "../cms/models/StrapiContentComponent";

function jsError(routeError: unknown) {
  if (typeof routeError === "string") return routeError.toUpperCase();
  if (routeError instanceof Error) return routeError.message;
}

function matchingError(
  routeError: unknown,
  errorPages?: Record<string, StrapiContentComponent[]>,
) {
  if (isRouteErrorResponse(routeError) && errorPages?.[routeError.status])
    return errorPages?.[routeError.status];
  if (errorPages?.["500"]) return errorPages?.["500"];
  return [fallbackStrapiInfoBox];
}

type ErrorBoxProps = {
  readonly errorPages?: Record<string, StrapiContentComponent[]>;
  readonly context: AppLoadContext;
};

export function ErrorBox({ errorPages, context }: ErrorBoxProps) {
  const routerError = useRouteError();
  const debugId = context.debugId as string | undefined;
  const isProd = config().ENVIRONMENT === "production";
  return (
    <div>
      <PageContent content={matchingError(routerError, errorPages)} />
      <Container>
        {debugId && <pre>ID: {debugId}</pre>}
        {!isProd && <pre>{jsError(routerError)}</pre>}
      </Container>
    </div>
  );
}
