import { Link } from "@remix-run/react";
import { getTranslationByKey } from "~/services/translations/getTranslationByKey";
import { useTranslations } from "~/services/translations/translationsContext";

const SKIP_TO_CONTENT_TRANSLATION_KEY = "skip-to-content";

export function SkipToContentLink() {
  const { accessibility: accessibilityTranslations } = useTranslations();
  return (
    <Link
      to={"#main"}
      className="bg-yellow-300 px-8 py-6 text-blue-800 ds-label-01-reg"
      id="skip-to-content-link"
    >
      ↓
      {` ${getTranslationByKey(
        SKIP_TO_CONTENT_TRANSLATION_KEY,
        accessibilityTranslations,
      )}`}
    </Link>
  );
}
