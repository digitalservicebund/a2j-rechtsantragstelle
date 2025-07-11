import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import ContentComponents from "~/components/ContentComponents";
import { fetchPage } from "~/services/cms/index.server";
import { throw404IfFeatureFlagDisabled } from "~/services/errorPages/throw404";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { pathname } = new URL(request.url);

  try {
    const { content, pageMeta } = await fetchPage(pathname);
    if (pathname.startsWith("/geld-einklagen"))
      await throw404IfFeatureFlagDisabled("showGeldEinklagenFlow");

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
