import KernButton from "~/components/kern/KernButton";
import KernHeading from "~/components/kern/KernHeading";
import { defaultLocale } from "~/services/cms/models/StrapiLocale";
import { extractTranslations } from "~/services/translations/getTranslationByKey";
import { translations as staticTranslations } from "~/services/translations/translations";

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

export const DataProtectionBanner = ({
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
      className="border-2 border-blue-800 z-10 bg-blue-300 absolute bottom-0 left-0 right-0"
      aria-label="Datenschutz banner"
    >
      <div className="p-16 gap-y-28 flex flex-col flex-wrap">
        <KernHeading
          text={translations[DATA_PROTECTION_TRANSLATION_KEYS.header]}
        />
        <p>{translations[DATA_PROTECTION_TRANSLATION_KEYS.content]}</p>
        <a
          href="/datenschutzerklaerung"
          className="flex gap-2 ds-link-01-bold items-start"
        >
          {translations[DATA_PROTECTION_TRANSLATION_KEYS.link]}
        </a>
        <KernButton
          onClick={onCookiesAccepted}
          text={translations[DATA_PROTECTION_TRANSLATION_KEYS.activateVideo]}
          className="max-w-fit"
        />
      </div>
    </section>
  );
};
