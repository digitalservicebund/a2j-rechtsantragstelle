import type { LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import { useShowKernUX } from "~/components/hooks/useShowKernUX";
import { fetchPage } from "~/services/cms/index.server";
import { throw404OnProduction } from "~/services/errorPages/throw404";
import { isNonProductiveRoute } from "~/services/routing/nonProductionRoutes";
import { getRedirect } from "~/services/routing/redirects";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { pathname } = new URL(request.url);
  if (isNonProductiveRoute(pathname)) throw404OnProduction();

  const redirectDestination = getRedirect(pathname);
  if (redirectDestination) return redirect(redirectDestination, 301);

  try {
    const { content, pageMeta } = await fetchPage(pathname);
    return { content, meta: pageMeta };
  } catch (error) {
    if ((error as Error).name === "StrapiPageNotFound") {
      throw new Response(null, { status: 404 });
    }
    throw error;
  }
};

// Don't accept any mutations on content routes. This safely catches bot POST/PUT spam without crashing or alerting Sentry
export const action = async () =>
  new Response("Method Not Allowed", { status: 405 });

export default function Index() {
  const { content } = useLoaderData<typeof loader>();
  const showKernUX = useShowKernUX();
  return <ContentComponents content={content} showKernUX={showKernUX} />;
}
