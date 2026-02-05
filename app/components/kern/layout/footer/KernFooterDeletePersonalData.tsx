import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { translations } from "~/services/translations/translations";
import { footerContent } from "./footerContent";

export const KernFooterDeletePersonalData = () => {
  const personalDataDeleteLink = footerContent.find((section) =>
    section.type.includes("deletionBanner"),
  )?.content[0];

  return (
    <GridSection className="bg-kern-neutral-025">
      <Grid>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 8 }}
          xlColumn={{ start: 2, span: 10 }}
          className="text-white print:hidden text-center pt-16 pb-16"
        >
          <div className="text-center print:hidden">
            <a className="kern-link" href={personalDataDeleteLink?.url}>
              {translations["delete-data"].footerLinkLabel.de ??
                personalDataDeleteLink?.text}
            </a>
          </div>
        </GridItem>
      </Grid>
    </GridSection>
  );
};
