import LocalLibrary from "@digitalservicebund/icons/LocalLibrary";
import SignLanguage from "@digitalservicebund/icons/SignLanguage";
import { StandaloneLink } from "~/components/common/StandaloneLink";
import Kopfzeile from "~/components/layout/Kopfzeile";
import { translations } from "~/services/translations/translations";
import { toHourAndMinuteTime, today, toGermanDateFormat } from "~/util/date";
import { useShouldPrint } from "../hooks/useShouldPrint";
import { Grid } from "./grid/Grid";
import { GridItem } from "./grid/GridItem";
import { GridSection } from "./grid/GridSection";

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
          {translations.pageHeader.printPage.de} {toGermanDateFormat(today())}{" "}
          {translations.pageHeader.at.de} {toHourAndMinuteTime(today())}{" "}
          {translations.pageHeader.time.de}
        </span>
      )}
      <GridSection bgClass="bg-[#F0F0F0]">
        <Grid>
          <GridItem
            span={12}
            mdSpan={12}
            mdStart={1}
            lgStart={1}
            lgSpan={12}
            xlStart={1}
            xlSpan={12}
          >
            <Kopfzeile />
          </GridItem>
        </Grid>
      </GridSection>
      <GridSection>
        <Grid className="mt-16 mb-16">
          <GridItem
            span={12}
            mdSpan={12}
            mdStart={1}
            lgStart={1}
            lgSpan={12}
            xlStart={1}
            xlSpan={12}
          >
            <nav
              className={`flex flex-wrap justify-between items-center`}
              aria-label={translations.pageHeader.mainNavigationAriaLabel.de}
            >
              <a
                href="/"
                className="ds-label-01-bold no-underline hover:underline mr-8 text-black focus:outline-solid active:underline active:decoration-4 leading-normal"
                aria-label={`${title} - ${linkLabel}`}
              >
                {title}
              </a>
              {!hideLinks && (
                <div className="flex gap-20 max-[425px]:pt-16">
                  <StandaloneLink
                    url={"/leichtesprache"}
                    text={translations.pageHeader.leichtesprache.de}
                    className="flex basis ds-label-03-reg items-center"
                    icon={<LocalLibrary className="inline mr-10" />}
                  />
                  <StandaloneLink
                    url={"/gebaerdensprache"}
                    text={
                      "Gebärdensprache" /* translations.pageHeader.gebaerdensprache.de */
                    }
                    className="flex basis ds-label-03-reg items-center"
                    icon={<SignLanguage className="inline mr-10" />}
                  />
                </div>
              )}
            </nav>
          </GridItem>
        </Grid>
      </GridSection>
    </header>
  );
}
