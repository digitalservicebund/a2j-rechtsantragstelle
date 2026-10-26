import { type LoaderFunctionArgs } from "react-router";
import { fetchPage } from "~/services/cms/index.server";
import { isFeatureFlagEnabled } from "~/services/isFeatureFlagEnabled.server";
export { HubPage as default } from "~/routes/shared/components/HubPage";

export const loader = async ({ url }: LoaderFunctionArgs) => {
  const { pathname } = url;
  try {
    const [{ content, pageMeta }, showNewHubPage] = await Promise.all([
      fetchPage(pathname),
      isFeatureFlagEnabled("showNewHubPage"),
    ]);

    return { content, meta: pageMeta, showNewHubPage };
  } catch (error) {
    if ((error as Error).name === "StrapiPageNotFound") {
      throw new Response(null, { status: 404 });
    }
    throw error;
  }
};
