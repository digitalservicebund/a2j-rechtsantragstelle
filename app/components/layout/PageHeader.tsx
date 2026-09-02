import { useShouldPrint } from "~/components/hooks/useShouldPrint";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { today, toGermanDateString, toGermanTimeString } from "~/util/date";
import Kopfzeile from "./Kopfzeile";
import { Icon } from "~/components/common/Icon";
import { layoutTranslations } from "~/services/translations/layout";

type PageHeaderProps = {
  title: string;
  linkLabel: string;
  hideLinks: boolean;
};

export default function PageHeader({
  title,
  linkLabel,
  hideLinks,
}: Readonly<PageHeaderProps>) {
  const shouldPrint = useShouldPrint();

  return (
    <header>
      {shouldPrint && (
        <span>
          {layoutTranslations.pageHeader.printPage.de}{" "}
          {toGermanDateString(today())} {layoutTranslations.pageHeader.at.de}{" "}
          {toGermanTimeString(today())} {layoutTranslations.pageHeader.time.de}
        </span>
      )}
      <GridSection className="bg-kern-neutral-025">
        <Grid>
          <GridItem
            smColumn={{ start: 1, span: 12 }}
            mdColumn={{ start: 1, span: 12 }}
            lgColumn={{ start: 1, span: 12 }}
            xlColumn={{ start: 1, span: 12 }}
          >
            <Kopfzeile />
          </GridItem>
        </Grid>
      </GridSection>
      <GridSection>
        <Grid>
          <GridItem
            smColumn={{ start: 1, span: 12 }}
            mdColumn={{ start: 1, span: 12 }}
            lgColumn={{ start: 1, span: 12 }}
            xlColumn={{ start: 1, span: 12 }}
            as="nav"
            className="flex flex-col md:flex-row md:justify-between md:items-center md:h-[80px] h-fit gap-kern-space-large md:gap-0 md:py-0 py-kern-space-large"
            ariaLabel={layoutTranslations.pageHeader.mainNavigationAriaLabel.de}
          >
            <a
              href="/"
              className="kern-title p-0!"
              aria-label={`${title} - ${linkLabel}`}
            >
              {title}
            </a>
            {!hideLinks && (
              <div className="flex  md:flex-row gap-kern-space-default md:gap-kern-space-x-large">
                <a
                  href={"/leichtesprache"}
                  className="flex items-center! kern-link text-kern-static-small! no-underline! hover:underline!"
                >
                  <Icon name="local-library" />
                  {layoutTranslations.pageHeader.leichtesprache.de}
                </a>

                <a
                  href={"/gebaerdensprache"}
                  className="flex items-center! kern-link text-kern-static-small! no-underline! hover:underline!"
                >
                  <Icon name="sign-language" />
                  {layoutTranslations.pageHeader.gebaerdensprache.de}
                </a>
              </div>
            )}
          </GridItem>
        </Grid>
      </GridSection>
    </header>
  );
}
