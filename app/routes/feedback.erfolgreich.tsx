import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import Button from "~/components/common/Button";
import { fetchPage } from "~/services/cms/index.server";

export const loader = async ({ url }: LoaderFunctionArgs) => {
  const { searchParams, pathname } = url;
  const urlParam = searchParams.get("url") ?? "";
  const { content, pageMeta } = await fetchPage(pathname);
  return { content, meta: pageMeta, url: urlParam };
};

export default function Index() {
  const { url, content } = useLoaderData<typeof loader>();
  return (
    <div>
      <ContentComponents content={content} />

      <div>
        {url && <Button href={url}>Zurück, wo Sie gekommen sind</Button>}
      </div>
    </div>
  );
}
