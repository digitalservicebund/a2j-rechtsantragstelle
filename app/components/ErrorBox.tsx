import { Await, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { Suspense } from "react";
import { getStrapiPage } from "~/services/cms/index.server";
import PageContent from "./PageContent";
import { Container } from ".";
import { config } from "~/services/env/web";

type ErrorPageContent = {
  content: ReturnType<typeof getStrapiPage>;
  additionalContext: string | undefined;
};

export function errorPageFromRouteError(
  routeError: ReturnType<typeof useRouteError>,
) {
  const errorPage: ErrorPageContent = {
    content: getStrapiPage({ slug: "/error/fallback" }),
    additionalContext: undefined,
  };

  if (isRouteErrorResponse(routeError)) {
    errorPage.content = getStrapiPage({
      slug: `/error/${routeError.status}`,
    });
  } else if (config().ENVIRONMENT !== "production") {
    if (typeof routeError === "string") {
      errorPage.additionalContext = routeError.toUpperCase();
    } else if (routeError instanceof Error) {
      errorPage.additionalContext = routeError.message;
    }
  }

  return errorPage;
}

export default function ErrorBox() {
  const { content, additionalContext } = errorPageFromRouteError(
    useRouteError(),
  );
  const fallbackError = (
    <Await resolve={getStrapiPage({ slug: "/error/fallback" })}>
      {(pageContent) => <PageContent {...pageContent} />}
    </Await>
  );
  return (
    <div>
      <Suspense>
        <Await resolve={content} errorElement={fallbackError}>
          {(pageContent) => <PageContent {...pageContent} />}
        </Await>
      </Suspense>
      <Container>
        <pre>{additionalContext}</pre>
      </Container>
    </div>
  );
}
