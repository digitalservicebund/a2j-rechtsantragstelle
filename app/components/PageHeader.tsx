import LocalLibrary from "@digitalservicebund/icons/LocalLibrary";
import SignLanguage from "@digitalservicebund/icons/SignLanguage";
import Kopfzeile from "~/components/Kopfzeile";
import { StandaloneLink } from "~/components/StandaloneLink";

type PageHeaderProps = {
  title: string;
  linkLabel: string;
  hideLinks: boolean;
  showKopfzeile?: boolean;
  translations: {
    leichtesprache: string;
    gebaerdensprache: string;
    mainNavigationAriaLabel: string;
  };
};

export default function Header({
  title,
  linkLabel,
  hideLinks,
  translations,
  showKopfzeile,
}: Readonly<PageHeaderProps>) {
  return (
    <header>
      {showKopfzeile && <Kopfzeile />}
      <nav
        className="py-20 px-16 flex flex-wrap justify-between"
        aria-label={translations.mainNavigationAriaLabel}
      >
        <a
          href="/"
          className="ds-label-01-bold no-underline hover:underline mr-8 text-black focus:outline active:underline active:decoration-4 leading-normal"
          aria-label={`${title} - ${linkLabel}`}
        >
          {title}
        </a>
        {!hideLinks && (
          <div className="flex gap-20 max-sm:pt-16">
            <StandaloneLink
              url={"/leichtesprache"}
              text={translations.leichtesprache}
              className="flex basis-1/2 ds-label-03-reg items-center"
              icon={<LocalLibrary className="inline mr-10" />}
            />
            <StandaloneLink
              url={"/gebaerdensprache"}
              text={translations.gebaerdensprache}
              className="flex basis-1/2 ds-label-03-reg items-center"
              icon={<SignLanguage className="inline mr-10" />}
            />
          </div>
        )}
      </nav>
    </header>
  );
}
