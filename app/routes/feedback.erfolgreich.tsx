import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import KernButton from "~/components/kern/KernButton";
import { strapiPageFromRequest } from "~/services/cms/index.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url") ?? "";
  const { content, pageMeta } = await strapiPageFromRequest({ request });
  return { content, meta: pageMeta, url };
};

export default function Index() {
  const { url, content } = useLoaderData<typeof loader>();
  return (
    <div>
      <ContentComponents content={content} />

      <div>
        {url && (
          <KernButton href={url}>Zurück, wo Sie gekommen sind</KernButton>
        )}
      </div>
    </div>
  );
}
