import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import PageContent from "~/components/PageContent";
import { strapiPageFromRequest } from "~/services/cms/index.server";
import { throw404OnProduction } from "~/services/errorPages/throw404";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  throw404OnProduction();
  const { content, pageMeta } = await strapiPageFromRequest({ request });
  return { content, meta: pageMeta };
};

export default function Kitchensink() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-grow">
      {loaderData.content ? (
        <PageContent content={loaderData.content} />
      ) : (
        "No kitchensink page found in CMS!"
      )}
    </div>
  );
}
