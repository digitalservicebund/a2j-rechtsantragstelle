import type { StrapiContentComponent } from "~/services/cms/models/formElements/StrapiContentComponent";
import ContentComponents from "~/components/content/ContentComponents";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import KernLicenseList from "~/services/openSourceLicenses/KernOpenSourceLicenses";

type KernOpenSourceProps = {
  content: StrapiContentComponent[];
  dependencies: {
    directDependencies: Record<string, { licenses: string | string[]; publisher?: string; repository?: string }>;
    mentionableTransitiveDependencies: Record<string, { licenses: string | string[]; publisher?: string; repository?: string }>;
  };
};

export default function KernOpenSource({ content, dependencies }: KernOpenSourceProps) {
  return (
    <div className="flex flex-col grow">
      <ContentComponents content={content} showKernUX={true} />
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
