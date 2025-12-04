import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import { useShowKernUX } from "~/components/hooks/useShowKernUX";
import { fetchPage } from "~/services/cms/index.server";
import { config } from "~/services/env/env.server";
import { throw404OnProduction } from "~/services/errorPages/throw404";
import { logError } from "~/services/logging";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  throw404OnProduction();
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const url = searchParams.get("url");
  const status = searchParams.get("status") ?? undefined;
  const error404 = new Response(null, { status: 404 });
  if (!url || secret !== config().STRAPI_PREVIEW_SECRET) throw error404;

  try {
    const { content, pageMeta } = await fetchPage(url, status);
    return { content, meta: pageMeta };
  } catch (error) {
    logError({ error });
    throw error404;
  }
};

export default function Index() {
  const { content } = useLoaderData<typeof loader>();
  const showKernUX = useShowKernUX();
  return <ContentComponents content={content} showKernUX={showKernUX} />;
}
