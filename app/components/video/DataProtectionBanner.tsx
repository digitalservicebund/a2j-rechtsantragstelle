import Button from "~/components/Button";
import Heading from "~/components/Heading";
import RichText from "~/components/RichText";
import { useVideoTranslations } from "~/components/video/VideoTranslationContext";
import { getTranslationByKey } from "~/util/getTranslationByKey";

export const HEADER_TRANSLATION_KEY = "datenschutz-header";
export const DATA_PROTECTION_TRANSLATION_KEY = "datenschutz";
export const ACTIVATE_VIDEO_TRANSLATION_KEY = "video-aktivieren";

export const DataProtectionBanner = ({
  onCookiesAccepted,
}: {
  onCookiesAccepted: () => void;
}) => {
  const { translations } = useVideoTranslations();
  return (
    <section
      className="border-2 border-blue-800 z-10 bg-blue-300 absolute bottom-0 left-0 right-0"
      aria-label="Datenschutz banner"
    >
      <div className="p-16 gap-y-28 flex flex-col flex-wrap">
        <Heading
          text={getTranslationByKey(HEADER_TRANSLATION_KEY, translations)}
          look="ds-heading-03-reg"
        />
        <RichText
          markdown={getTranslationByKey(
            DATA_PROTECTION_TRANSLATION_KEY,
            translations,
          )}
        />
        <Button
          onClick={onCookiesAccepted}
          text={getTranslationByKey(
            ACTIVATE_VIDEO_TRANSLATION_KEY,
            translations,
          )}
          className="max-w-fit"
          size="large"
        />
      </div>
    </section>
  );
};
