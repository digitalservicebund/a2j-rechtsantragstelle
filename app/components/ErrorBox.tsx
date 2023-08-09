import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import PageContent from "./PageContent";
import { Container } from ".";
import { config } from "~/services/env/web";
import type { StrapiPage } from "~/services/cms/models/StrapiPage";

export function getJavaScriptErrorInDevEnvironments(
  routeError: ReturnType<typeof useRouteError>,
) {
  if (config().ENVIRONMENT !== "production") {
    if (typeof routeError === "string") {
      return routeError.toUpperCase();
    } else if (routeError instanceof Error) {
      return routeError.message;
    }
  }
}

export default function ErrorBox({
  errorPages,
}: {
  errorPages?: Record<string, StrapiPage>;
}) {
  const routerError = useRouteError();
  const javaScriptError = getJavaScriptErrorInDevEnvironments(routerError);
  let content;

  if (isRouteErrorResponse(routerError)) {
    content = errorPages?.[routerError.status]?.content;
  }

  if (content == undefined) {
    // TODO introduce real fallback text (not even strapi/file are readable)
    content = errorPages?.["fallback"]?.content ?? [];
  }

  return (
    <div>
      <PageContent content={content} />

      <Container>
        <pre>{javaScriptError}</pre>
      </Container>
    </div>
  );
}
