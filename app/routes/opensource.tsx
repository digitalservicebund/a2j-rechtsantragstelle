import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Container from "~/components/Container";
import PageContent from "~/components/PageContent";
import { strapiPageFromRequest } from "~/services/cms/index.server";
import { dependencies } from "~/services/openSourceLicenses/dependencies.server";
import LicenseList from "~/services/openSourceLicenses/LicenseList";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { content, pageMeta } = await strapiPageFromRequest({ request });
  return json({
    meta: pageMeta,
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
