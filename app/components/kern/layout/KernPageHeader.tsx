import { useShouldPrint } from "~/components/hooks/useShouldPrint";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { translations } from "~/services/translations/translations";
import { toHourAndMinuteTime, today, toGermanDateFormat } from "~/util/date";
import KernKopfzeile from "./KernKopfzeile";
import { KernIcon } from "~/components/kern/common/KernIcon";

type PageHeaderProps = {
  title: string;
  linkLabel: string;
  hideLinks: boolean;
};

export default function KernPageHeader({
  title,
  linkLabel,
  hideLinks,
}: Readonly<PageHeaderProps>) {
  const shouldPrint = useShouldPrint();

  return (
    <header>
      {shouldPrint && (
        <span>
          {translations.pageHeader.printPage.de} {toGermanDateFormat(today())}{" "}
          {translations.pageHeader.at.de} {toHourAndMinuteTime(today())}{" "}
          {translations.pageHeader.time.de}
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
            <KernKopfzeile />
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
            className="flex flex-row justify-between items-center h-[80px]"
            aria-label={translations.pageHeader.mainNavigationAriaLabel.de}
          >
            <a
              href="/"
              className="kern-link"
              aria-label={`${title} - ${linkLabel}`}
            >
              {title}
            </a>
            {!hideLinks && (
              <div className="flex gap-kern-space-x-large max-[447px]:pt-16">
                <a
                  href={"/leichtesprache"}
                  className="kern-link kern-link--small"
                >
                  <KernIcon name="local-library" className="flex-shrink-0" />
                  {translations.pageHeader.leichtesprache.de}
                </a>

                <a
                  href={"/gebaerdensprache"}
                  className="kern-link kern-link--small"
                >
                  <KernIcon name="sign-language" className="flex-shrink-0" />
                  {"Gebärdensprache"}{" "}
                  {/*translations.pageHeader.gebaerdensprache.de */}
                </a>
              </div>
            )}
          </GridItem>
        </Grid>
      </GridSection>
    </header>
  );
}
