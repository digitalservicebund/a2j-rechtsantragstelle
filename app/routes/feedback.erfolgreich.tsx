import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import Button from "~/components/common/Button";
import ContentComponents from "~/components/content/ContentComponents";
import Container from "~/components/layout/Container";
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

      <Container>
        {url && <Button href={url}>Zurück, wo Sie gekommen sind</Button>}
      </Container>
    </div>
  );
}
