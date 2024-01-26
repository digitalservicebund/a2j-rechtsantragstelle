import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PageContent from "~/components/PageContent";
import { strapiPageFromRequest } from "~/services/cms/index.server";
import Container from "~/components/Container";
import LicenseList from "~/services/openSourceLicenses/LicenseList";
import { dependencies } from "~/services/openSourceLicenses/dependencies.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { content, meta } = await strapiPageFromRequest({ request });
  return json({
    meta,
    content,
    dependencies,
  });
};

export default function Index() {
  const { content, dependencies } = useLoaderData<typeof loader>();
  return (
    <>
      <PageContent content={content} />
      <Container>
        <LicenseList dependencies={dependencies} />
      </Container>
    </>
  );
}
