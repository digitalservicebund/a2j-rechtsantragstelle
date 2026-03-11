import { defaultLocale } from "~/services/cms/models/StrapiLocale";
import { extractTranslations } from "~/services/translations/getTranslationByKey";
import { translations as staticTranslations } from "~/services/translations/translations";
import KernHeading from "../KernHeading";
import { KernIcon } from "../common/KernIcon";
import KernButton from "../KernButton";

const DATA_PROTECTION_TRANSLATION_KEYS = {
  header: "datenschutz-header",
  content: "datenschutz",
  activateVideo: "video-aktivieren",
  link: "datenschutz-link",
} as const;

export const DATA_PROTECTION_TRANSLATION_VALUES = Object.values(
  DATA_PROTECTION_TRANSLATION_KEYS,
);

export const videoTranslations = Object.fromEntries(
  Object.entries(staticTranslations.video).map(([key, value]) => [
    key,
    value[defaultLocale],
  ]),
);

export const KernDataProtectionBanner = ({
  onCookiesAccepted,
}: {
  onCookiesAccepted: () => void;
}) => {
  const translations = extractTranslations(
    DATA_PROTECTION_TRANSLATION_VALUES,
    videoTranslations,
  );

  return (
    <section
      className="kern-dialog absolute bottom-0 left-0 !max-w-full md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[70%]"
      aria-label="Datenschutz banner"
    >
      <div className="kern-dialog__header  pt-kern-space-default!">
        <KernHeading
          text={translations[DATA_PROTECTION_TRANSLATION_KEYS.header]}
          tagName="h2"
          managedByParent
        />
      </div>
      <div className="kern-dialog__body">
        <p>{translations[DATA_PROTECTION_TRANSLATION_KEYS.content]}</p>
        <a href="/datenschutz" className="kern-link">
          <KernIcon name="arrow-forward" />
          {translations[DATA_PROTECTION_TRANSLATION_KEYS.link]}
        </a>
      </div>
      <div className="kern-dialog__footer">
        <KernButton
          onClick={onCookiesAccepted}
          text={translations[DATA_PROTECTION_TRANSLATION_KEYS.activateVideo]}
          look="secondary"
        />
      </div>
    </section>
  );
};
