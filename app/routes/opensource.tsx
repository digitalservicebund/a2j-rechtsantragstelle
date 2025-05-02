import { type LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import Container from "~/components/Container";
import PageContent from "~/components/PageContent";
import { strapiPageFromRequest } from "~/services/cms/index.server";
import { dependencies } from "~/services/openSourceLicenses/dependencies.server";
import LicenseList from "~/services/openSourceLicenses/LicenseList";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { content, pageMeta } = await strapiPageFromRequest({ request });
  return {
    meta: pageMeta,
    content,
    dependencies,
  };
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
