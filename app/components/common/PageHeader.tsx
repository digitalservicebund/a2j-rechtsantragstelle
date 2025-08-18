import LocalLibrary from "@digitalservicebund/icons/LocalLibrary";
import SignLanguage from "@digitalservicebund/icons/SignLanguage";
import { alignToContainer } from "~/components";
import Kopfzeile from "~/components/common/Kopfzeile";
import { StandaloneLink } from "~/components/StandaloneLink";
import { translations } from "~/services/translations/translations";
import { toHourAndMinuteTime, today, toGermanDateFormat } from "~/util/date";
import { useShouldPrint } from "../hooks/useShouldPrint";

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
      <Kopfzeile />
      <nav
        className={`!pt-16 !pb-24 px-16 flex flex-wrap justify-between ${alignToContainer}`}
        aria-label={translations.pageHeader.mainNavigationAriaLabel.de}
      >
        <a
          href="/"
          className="ds-label-01-bold no-underline hover:underline mr-8 text-black focus:outline active:underline active:decoration-4 leading-normal"
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
    </header>
  );
}
