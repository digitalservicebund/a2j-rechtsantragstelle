import { type LoaderFunctionArgs } from "react-router";
import { fetchPage } from "~/services/cms/index.server";
export { HubPage as default } from "~/routes/shared/components/HubPage";

export const loader = async ({ url }: LoaderFunctionArgs) => {
  const { pathname } = url;
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
