import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import { fetchPage } from "~/services/cms/index.server";
import { throw404IfFeatureFlagDisabled } from "~/services/errorPages/throw404";
import { isFeatureFlagEnabled } from "~/services/isFeatureFlagEnabled.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await throw404IfFeatureFlagDisabled("showGeldEinklagenFlow");

  const { pathname } = new URL(request.url);
  try {
    const { content, pageMeta } = await fetchPage(pathname);
    const showKernUX = await isFeatureFlagEnabled("showKernUX");
    return { content, meta: pageMeta, showKernUX };
  } catch (error) {
    if ((error as Error).name === "StrapiPageNotFound") {
      throw new Response(null, { status: 404 });
    }
    throw error;
  }
};

export default function Index() {
  const { content, showKernUX } = useLoaderData<typeof loader>();
  return <ContentComponents content={content} showKernUX={!!showKernUX} />;
}
