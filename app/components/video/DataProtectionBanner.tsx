import Button from "~/components/Button";
import Heading from "~/components/Heading";
import { extractTranslations } from "~/services/translations/getTranslationByKey";
import { useTranslations } from "~/services/translations/translationsContext";
import { StandaloneLink } from "../StandaloneLink";

const DATA_PROTECTION_TRANSLATION_KEYS = {
  header: "datenschutz-header",
  content: "datenschutz",
  activateVideo: "video-aktivieren",
  link: "datenschutz-link",
} as const;

export const DATA_PROTECTION_TRANSLATION_VALUES = Object.values(
  DATA_PROTECTION_TRANSLATION_KEYS,
);

export const DataProtectionBanner = ({
  onCookiesAccepted,
}: {
  onCookiesAccepted: () => void;
}) => {
  const translations = extractTranslations(
    DATA_PROTECTION_TRANSLATION_VALUES,
    useTranslations().video,
  );

  return (
    <section
      className="border-2 border-blue-800 z-10 bg-blue-300 absolute bottom-0 left-0 right-0"
      aria-label="Datenschutz banner"
    >
      <div className="p-16 gap-y-28 flex flex-col flex-wrap">
        <Heading
          text={translations[DATA_PROTECTION_TRANSLATION_KEYS.header]}
          look="ds-heading-03-reg"
        />
        <p>{translations[DATA_PROTECTION_TRANSLATION_KEYS.content]}</p>
        <StandaloneLink
          text={translations[DATA_PROTECTION_TRANSLATION_KEYS.link]}
          url="/datenschutz"
        />
        <Button
          onClick={onCookiesAccepted}
          text={translations[DATA_PROTECTION_TRANSLATION_KEYS.activateVideo]}
          className="max-w-fit"
          size="large"
        />
      </div>
    </section>
  );
};
