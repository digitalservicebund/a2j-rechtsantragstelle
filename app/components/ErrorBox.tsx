import { Await, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { Suspense } from "react";
import { getStrapiPage } from "~/services/cms";
import PageContent from "./PageContent";
import { Container } from ".";
import { config } from "~/services/env/web";

type ErrorPageContent = {
  content: ReturnType<typeof getStrapiPage> | undefined;
  additionalContext: string | undefined;
};

export function errorPageFromRouteError(
  routeError: ReturnType<typeof useRouteError>,
) {
  const errorPage: ErrorPageContent = {
    content: undefined,
    additionalContext: undefined,
  };

  if (isRouteErrorResponse(routeError)) {
    try {
      errorPage.content = getStrapiPage({
        slug: `/error/${routeError.status}`,
      });
    } catch {
      console.error(`Unknown Route error: ${routeError.status}`);
    }
  } else if (config().ENVIRONMENT === "staging") {
    if (typeof routeError === "string") {
      errorPage.additionalContext = routeError.toUpperCase();
    } else if (routeError instanceof Error) {
      errorPage.additionalContext = routeError.message;
    }
  }

  if (!errorPage.content)
    errorPage.content = getStrapiPage({ slug: "/error/fallback" });

  return errorPage;
}

export default function ErrorBox() {
  const { content, additionalContext } = errorPageFromRouteError(
    useRouteError(),
  );
  return (
    <div>
      {content && (
        <Suspense>
          <Await resolve={content}>
            {(pageContent) => <PageContent {...pageContent} />}
          </Await>
        </Suspense>
      )}

      <Container>
        <pre>{additionalContext}</pre>
      </Container>
    </div>
  );
}
