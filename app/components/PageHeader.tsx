import LocalLibrary from "@digitalservicebund/icons/LocalLibrary";
import SignLanguage from "@digitalservicebund/icons/SignLanguage";
import classNames from "classnames";
import { alignToContainer, GridContainer, GridItem } from "~/components";
import Kopfzeile from "~/components/Kopfzeile";
import { StandaloneLink } from "~/components/StandaloneLink";
import { translations } from "~/services/translations/translations";

type PageHeaderProps = {
  title: string;
  linkLabel: string;
  hideLinks: boolean;
  alignToMainContainer?: boolean;
};

export default function PageHeader({
  title,
  linkLabel,
  hideLinks,
  alignToMainContainer,
}: Readonly<PageHeaderProps>) {
  const navClassNames = classNames(
    "flex flex-wrap justify-between",
    "h-[64px] items-center",
  );

  return (
    <header>
      <GridContainer columns={12} maxWidth="xl">
        <GridItem
          span={12}
          spanXs={12}
          spanSm={12}
          spanMd={12}
          spanLg={12}
          colStartXs={1}
          colStartSm={1}
          colStartMd={1}
          colStartLg={1}
        >
          {/* <Kopfzeile alignToMainContainer={false} /> */}
          <nav
            className={navClassNames}
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
        </GridItem>
      </GridContainer>
    </header>
  );
}
