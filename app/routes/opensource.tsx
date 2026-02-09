import { type LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import { useShowKernUX } from "~/components/hooks/useShowKernUX";
import Container from "~/components/layout/Container";
import { strapiPageFromRequest } from "~/services/cms/index.server";
import { dependencies } from "~/services/openSourceLicenses/dependencies.server";
import LicenseList from "~/services/openSourceLicenses/LicenseList";
import KernOpenSource from "./kern/kern-opensource";

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

  const showKernUX = useShowKernUX();

  if (showKernUX) {
    return <KernOpenSource />;
  }

  return (
    <div className="flex flex-col grow">
      <ContentComponents content={content} />
      <div className="w-full">
        <Container>
          <LicenseList dependencies={dependencies} />
        </Container>
      </div>
    </div>
  );
}
