import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import PageContent from "../../components/PageContent";
import { Container } from "../../components";
import { config } from "~/services/env/web";
import type { StrapiPage } from "~/services/cms/models/StrapiPage";
import { getStrapiPage } from "~/services/cms/index.server";

const errorCodes = ["404", "500", "403", "fallback"] as const;
type ErrorPages = Record<string, StrapiPage["content"]>;
const errorSlugPrefix = "/error/";

export async function getErrorPages() {
  const errorPagePromises = errorCodes.map((errorCode) =>
    getStrapiPage({ slug: `${errorSlugPrefix}${errorCode}` }),
  );
  const availableErrorPages = (
    await Promise.allSettled(errorPagePromises)
  ).filter(
    (errorPagePromise) => errorPagePromise.status === "fulfilled",
  ) as PromiseFulfilledResult<StrapiPage>[];

  return Object.fromEntries(
    availableErrorPages.map((errorPage) => [
      errorPage.value.slug.replace(errorSlugPrefix, ""),
      errorPage.value.content,
    ]),
  );
}

function getJavaScriptErrorInDevEnvironments(
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

export function ErrorBox({ errorPages }: { errorPages?: ErrorPages }) {
  const routerError = useRouteError();
  let content: StrapiPage["content"] | undefined;

  if (isRouteErrorResponse(routerError)) {
    content = errorPages?.[routerError.status];
  }
  if (!content) {
    // TODO introduce real fallback text (not even strapi/file are readable)
    content = errorPages?.["fallback"] ?? [];
  }
  return (
    <div>
      <PageContent content={content} />
      <Container>
        <pre>{getJavaScriptErrorInDevEnvironments(routerError)}</pre>
      </Container>
    </div>
  );
}
