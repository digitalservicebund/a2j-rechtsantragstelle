import Image from "~/components/common/Image";
import { GridItem } from "~/components/layout/grid/GridItem";
import { Grid } from "~/components/layout/grid/Grid";
import { KernFooterExternalLinks } from "./KernFooterExternalLinks";
import { KernFooterDeletePersonalData } from "./KernFooterDeletePersonalData";
import { KernFooterInternalLinks } from "./KernFooterInternalLinks";
import { GridSection } from "~/components/layout/grid/GridSection";
import BMJVLogo from "~/assets/BMJV_Logo.svg?raw";

type FooterProps = Readonly<{
  showDeletionBanner?: boolean;
  ariaLabel?: string;
}>;

export default function KernFooter({
  showDeletionBanner = false,
  ariaLabel,
}: FooterProps) {
  return (
    <GridSection>
      <Grid className="pt-kern-space-x-large flex flex-col gap-y-32 pl-0! pr-0! print:pb-0 border-t-kern-neutral-100">
        <GridItem
          row={1}
          ariaLabel={ariaLabel}
          className="grid grid-cols-subgrid px-kern-space-small"
        >
          <div className="col-start-1 col-span-12 lg:col-span-6 p-kern-space-default! gap-kern-space-small">
            <h2 className="kern-title">Justiz-Services</h2>
            <p className="kern-body kern-body--muted text-kern-static-medium">
              Onlinedienste der Justiz
            </p>
          </div>
          <KernFooterInternalLinks />
        </GridItem>
        <GridItem
          row={2}
          className="grid grid-cols-subgrid px-kern-space-small"
        >
          <div className="forced-colors:bg-black col-start-1 col-span-12 lg:col-span-6 p-kern-space-default!">
            <Image
              svgString={BMJVLogo}
              url=""
              width={180}
              height={105}
              alternativeText="Logo des BMJVs"
            />
          </div>
          <KernFooterExternalLinks />
        </GridItem>
        {showDeletionBanner && <KernFooterDeletePersonalData />}
      </Grid>
    </GridSection>
  );
}
