import { json, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PageContent from "~/components/PageContent";
import { strapiPageFromRequest } from "~/services/cms/index.server";
import Container from "~/components/Container";
import LicenseList from "~/services/openSourceLicenses/LicenseList";

export const loader = async ({ request }: LoaderArgs) => {
  const { content, meta } = await strapiPageFromRequest({ request });
  return json({ meta, content });
};

export default function Index() {
  const { content } = useLoaderData<typeof loader>();
  return (
    <>
      <PageContent content={content} />
      <Container>
        <LicenseList />
      </Container>
    </>
  );
}
