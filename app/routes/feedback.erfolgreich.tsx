import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Button from "~/components/Button";
import Container from "~/components/Container";
import PageContent from "~/components/PageContent";
import { strapiPageFromRequest } from "~/services/cms/index.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url") ?? "";
  const { content, meta } = await strapiPageFromRequest({ request });
  return { content, meta, url };
};

export default function Index() {
  const { url, content } = useLoaderData<typeof loader>();
  return (
    <div>
      <PageContent content={content} />

      <Container>
        {url && <Button href={url}>Zurück, wo Sie gekommen sind</Button>}
      </Container>
    </div>
  );
}
