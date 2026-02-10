import { type LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { strapiPageFromRequest } from "~/services/cms/index.server";
import { dependencies } from "~/services/openSourceLicenses/dependencies.server";
import KernLicenseList from "~/services/openSourceLicenses/KernOpenSourceLicenses";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { content, pageMeta } = await strapiPageFromRequest({ request });
  return {
    meta: pageMeta,
    content,
    dependencies,
  };
};

export default function KernOpenSource() {
  const { content, dependencies } = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col grow">
      <ContentComponents content={content} />
      <GridSection>
        <Grid>
          <GridItem
            mdColumn={{ start: 1, span: 7 }}
            lgColumn={{ start: 3, span: 7 }}
            xlColumn={{ start: 3, span: 7 }}
          >
            <KernLicenseList dependencies={dependencies} />
          </GridItem>
        </Grid>
      </GridSection>
    </div>
  );
}
