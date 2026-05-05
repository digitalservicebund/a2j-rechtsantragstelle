import Image from "~/components/common/Image";
import { GridItem } from "~/components/layout/grid/GridItem";
import { Grid } from "~/components/layout/grid/Grid";
import { FooterExternalLinks } from "./FooterExternalLinks";
import { FooterDeletePersonalData } from "./FooterDeletePersonalData";
import { FooterInternalLinks } from "./FooterInternalLinks";
import { GridSection } from "~/components/layout/grid/GridSection";
import BMJVLogo from "~/assets/BMJV_Logo.svg?raw";
import { translations } from "~/services/translations/translations";

type FooterProps = Readonly<{
  showDeletionBanner?: boolean;
  ariaLabel?: string;
}>;

export const logoAltText = "Logo des BMJVs";

export default function Footer({
  showDeletionBanner = false,
  ariaLabel,
}: FooterProps) {
  return (
    <GridSection className="border-t border-t-[#DFE1EA]">
      <Grid className="pt-kern-space-x-large flex flex-col gap-y-32 pl-0! pr-0! print:pb-0">
        <GridItem
          row={1}
          ariaLabel={ariaLabel}
          className="grid grid-cols-subgrid px-kern-space-small"
        >
          <div className="col-start-1 col-span-12 lg:col-span-6 p-kern-space-default! gap-kern-space-small">
            <h2 className="kern-title">
              {translations.footer.justizServices.de}
            </h2>
            <p className="kern-body kern-body--muted text-kern-static-medium">
              {translations.footer.onlineDienste.de}
            </p>
          </div>
          <FooterInternalLinks />
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
              alternativeText={logoAltText}
            />
          </div>
          <FooterExternalLinks />
        </GridItem>
      </Grid>
      {showDeletionBanner && <FooterDeletePersonalData />}
    </GridSection>
  );
}
