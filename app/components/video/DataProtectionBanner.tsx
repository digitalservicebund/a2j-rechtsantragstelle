import Button from "~/components/Button";
import Heading from "~/components/Heading";
import RichText from "~/components/RichText";
import { extractTranslations } from "~/services/translations/getTranslationByKey";
import { useTranslations } from "~/services/translations/translationsContext";

export const HEADER_TRANSLATION_KEY = "datenschutz-header";
export const DATA_PROTECTION_TRANSLATION_KEY = "datenschutz";
export const ACTIVATE_VIDEO_TRANSLATION_KEY = "video-aktivieren";

export const DataProtectionBanner = ({
  onCookiesAccepted,
}: {
  onCookiesAccepted: () => void;
}) => {
  const translations = extractTranslations(
    [
      HEADER_TRANSLATION_KEY,
      DATA_PROTECTION_TRANSLATION_KEY,
      ACTIVATE_VIDEO_TRANSLATION_KEY,
    ],
    useTranslations().video,
  );

  return (
    <section
      className="border-2 border-blue-800 z-10 bg-blue-300 absolute bottom-0 left-0 right-0"
      aria-label="Datenschutz banner"
    >
      <div className="p-16 gap-y-28 flex flex-col flex-wrap">
        <Heading
          text={translations[HEADER_TRANSLATION_KEY]}
          look="ds-heading-03-reg"
        />
        <RichText markdown={translations[DATA_PROTECTION_TRANSLATION_KEY]} />
        <Button
          onClick={onCookiesAccepted}
          text={translations[ACTIVATE_VIDEO_TRANSLATION_KEY]}
          className="max-w-fit"
          size="large"
        />
      </div>
    </section>
  );
};
