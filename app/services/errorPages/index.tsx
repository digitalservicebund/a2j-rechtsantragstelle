import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import PageContent from "../../components/PageContent";
import { Container } from "../../components";
import { config } from "~/services/env/web";
import type { StrapiPage } from "~/services/cms/models/StrapiPage";
import { fetchCollectionEntry } from "../cms/index.server";
import fallbackStrapiInfoBox from "./fallbackInfobox";

const errorCodes = ["404", "500", "403"] as const;
type ErrorPages = Record<string, StrapiPage["content"]>;
const errorSlugPrefix = "/error/";

export async function getErrorPages() {
  const errorPagePromises = errorCodes.map((errorCode) =>
    fetchCollectionEntry("pages", `${errorSlugPrefix}${errorCode}`),
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
  let content: StrapiPage["content"] = [fallbackStrapiInfoBox];
  if (isRouteErrorResponse(routerError) && errorPages?.[routerError.status])
    content = errorPages?.[routerError.status];
  else if (errorPages?.["500"]) content = errorPages?.["500"];

  return (
    <div>
      <PageContent content={content} />
      <Container>
        <pre>{getJavaScriptErrorInDevEnvironments(routerError)}</pre>
      </Container>
    </div>
  );
}
