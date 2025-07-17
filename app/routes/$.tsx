import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import ContentComponents from "~/components/ContentComponents";
import { fetchPage } from "~/services/cms/index.server";
import { throw404OnProduction } from "~/services/errorPages/throw404";
import { nonProductionRoutes } from "~/services/routing/nonProductionRoutes";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { pathname } = new URL(request.url);
  if (nonProductionRoutes.some((route) => pathname.startsWith(route)))
    throw404OnProduction();

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

export default function Index() {
  return <ContentComponents content={useLoaderData<typeof loader>().content} />;
}
