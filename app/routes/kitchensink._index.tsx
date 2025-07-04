import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import ContentComponents from "~/components/ContentComponents";
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
        <ContentComponents content={loaderData.content} />
      ) : (
        "No kitchensink page found in CMS!"
      )}
    </div>
  );
}
