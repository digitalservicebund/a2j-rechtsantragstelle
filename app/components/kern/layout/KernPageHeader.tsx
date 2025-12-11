import { useShouldPrint } from "~/components/hooks/useShouldPrint";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { translations } from "~/services/translations/translations";
import { toHourAndMinuteTime, today, toGermanDateFormat } from "~/util/date";
import KernKopfzeile from "./KernKopfzeile";
import { KernStandaloneLink } from "../KernStandaloneLink";

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
              className="kern-title"
              aria-label={`${title} - ${linkLabel}`}
            >
              {title}
            </a>
            {!hideLinks && (
              <div className="flex gap-kern-space-x-large max-[447px]:pt-16">
                <KernStandaloneLink
                  url={"/leichtesprache"}
                  text={translations.pageHeader.leichtesprache.de}
                  className="kern-link--small"
                  icon={
                    <span
                      className="kern-icon kern-icon--easy-language kern-icon--default mt-2"
                      aria-hidden="true"
                    ></span>
                  }
                />
                <KernStandaloneLink
                  url={"/gebaerdensprache"}
                  text={
                    "Gebärdensprache" /* translations.pageHeader.gebaerdensprache.de */
                  }
                  className="kern-link--small"
                  icon={
                    <span
                      className="kern-icon kern-icon--sign-language kern-icon--default mt-2"
                      aria-hidden="true"
                    ></span>
                  }
                />
              </div>
            )}
          </GridItem>
        </Grid>
      </GridSection>
    </header>
  );
}
