import type { LoaderFunctionArgs } from "react-router";
import { fetchJustizPage } from "~/services/cms/index.server";
import { throw404OnProduction } from "~/services/errorPages/throw404";
import { parseJustizDePath } from "~/services/routing/justizDe";
import { isNonProductiveRoute } from "~/services/routing/nonProductionRoutes";

// Shared by the index route (/justizde) and the splat route (/justizde/*),
// because a splat does not match the bare prefix.
export const justizDePageLoader = async ({ url }: LoaderFunctionArgs) => {
  const { pathname } = url;
  if (isNonProductiveRoute(pathname)) throw404OnProduction();

  // Strapi stores the original justiz.de paths; German and English share a
  // slug and differ only by locale.
  const { locale, slug } = parseJustizDePath(pathname);

  try {
    const { content, pageMeta } = await fetchJustizPage(slug, "draft", locale);
    return { content, meta: pageMeta };
  } catch (error) {
    if ((error as Error).name === "StrapiPageNotFound") {
      throw new Response(null, { status: 404 });
    }
    throw error;
  }
};

// Don't accept any mutations on content routes. This safely catches bot POST/PUT spam without crashing or alerting Sentry
export const justizDePageAction = async () =>
  new Response("Method Not Allowed", { status: 405 });
