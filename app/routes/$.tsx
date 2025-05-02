import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import PageContent from "~/components/PageContent";
import { strapiPageFromRequest } from "~/services/cms/index.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { content, pageMeta } = await strapiPageFromRequest({ request });
    return { content, meta: pageMeta };
  } catch (error) {
    if ((error as Error).name === "StrapiPageNotFound") {
      throw new Response(null, { status: 404 });
    }
    throw error;
  }
};

export default function Index() {
  return <PageContent content={useLoaderData<typeof loader>().content} />;
}
