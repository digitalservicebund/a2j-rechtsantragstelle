import { GridItem } from "~/components/layout/grid/GridItem";
import { Grid } from "~/components/layout/grid/Grid";
import { FooterExternalLinks } from "./FooterExternalLinks";
import { FooterDeletePersonalData } from "./FooterDeletePersonalData";
import { FooterInternalLinks } from "./FooterInternalLinks";
import { GridSection } from "~/components/layout/grid/GridSection";
import BMJVLogo from "~/assets/BMJV_Logo.svg?raw";
import { translations } from "~/services/translations/translations";
import classNames from "classnames";
import { isFlowIdInPathname } from "~/util/url";
import { useLocation } from "react-router";
import { InlineSvgImage } from "~/components/common/InlineSvgImage";

type FooterProps = Readonly<{
  showDeletionBanner?: boolean;
}>;

export const logoAltText = "Logo des BMJVs";

export default function Footer({ showDeletionBanner = false }: FooterProps) {
  const { pathname } = useLocation();
  return (
    <GridSection
      className={classNames("border-t border-t-[#DFE1EA]", {
        "mb-80 lg:mb-0": isFlowIdInPathname(pathname),
      })}
    >
      <Grid className="pt-kern-space-x-large flex flex-col gap-y-32 pl-0! pr-0! print:pb-0">
        <GridItem
          row={1}
          ariaLabel={translations.footer.internalLinks.de}
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
            <InlineSvgImage
              svgString={BMJVLogo}
              width={180}
              altText={logoAltText}
            />
          </div>
          <FooterExternalLinks />
        </GridItem>
      </Grid>
      {showDeletionBanner && <FooterDeletePersonalData />}
    </GridSection>
  );
}
