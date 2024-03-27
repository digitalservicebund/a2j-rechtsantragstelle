import type { Translations } from "~/services/cms/index.server";
import { sendSentryMessage } from "~/services/logging";

export function getTranslationByKey(
  translationKey: string,
  translationRecord: Translations,
): string {
  const translation = translationRecord[translationKey];

  if (typeof translation === "undefined") {
    sendSentryMessage(
      `Key translation ${translationKey} is not available in the translation record. Please take a look in the CMS system!`,
      "warning",
    );
    return translationKey;
  }

  return translation;
}
