import { type LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import Container from "~/components/layout/Container";
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
    <div className="flex flex-col flex-grow">
      <ContentComponents content={content} />
      <div className="w-full">
        <Container>
          <LicenseList dependencies={dependencies} />
        </Container>
      </div>
    </div>
  );
}
