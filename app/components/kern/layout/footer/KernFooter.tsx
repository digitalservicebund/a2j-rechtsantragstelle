import Image, { type ImageProps } from "~/components/common/Image";
import { GridItem } from "~/components/layout/grid/GridItem";
import { Grid } from "~/components/layout/grid/Grid";
import { KernFooterExternalLinks } from "./KernFooterExternalLinks";
import { KernFooterDeletePersonalData } from "./KernFooterDeletePersonalData";
import { KernFooterInternalLinks } from "./KernFooterInternalLinks";

type FooterProps = Readonly<{
  image?: ImageProps;
  showDeletionBanner?: boolean;
  ariaLabel?: string;
}>;

export default function KernFooter({
  image,
  showDeletionBanner = false,
  ariaLabel,
}: FooterProps) {
  return (
    <>
      <Grid className="py-40 px-0 print:pb-0">
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 1, span: 3 }}
          xlColumn={{ start: 1, span: 3 }}
          className="flex flex-col gap-kern-space-large"
        >
          {image && (
            <div className="forced-colors:bg-black">
              <Image {...image} />
            </div>
          )}
          <KernFooterExternalLinks />
        </GridItem>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 4, span: 9 }}
          xlColumn={{ start: 4, span: 9 }}
          className="[grid-row:2] md:[grid-row:2] lg:[grid-row:1] xl:[grid-row:1]"
          aria-label={ariaLabel}
        >
          <KernFooterInternalLinks />
        </GridItem>
      </Grid>
      {showDeletionBanner && <KernFooterDeletePersonalData />}
    </>
  );
}
