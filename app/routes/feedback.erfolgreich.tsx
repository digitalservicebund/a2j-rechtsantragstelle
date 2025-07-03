import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import Button from "~/components/Button";
import Container from "~/components/Container";
import StrapiContentComponents from "~/components/StrapiContentComponents";
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
      <StrapiContentComponents content={content} />

      <Container>
        {url && <Button href={url}>Zurück, wo Sie gekommen sind</Button>}
      </Container>
    </div>
  );
}
