import type { Translations } from "~/services/cms/index.server";
import { sendSentryMessage } from "~/services/logging";

export function getTranslationByKey(
  key: string,
  translations?: Translations,
): string {
  const translation = translations?.[key];
  if (!translation) {
    sendSentryMessage(
      `Key translation ${key} is not available in the translation record. Please take a look in the CMS system!`,
      "warning",
    );
  }
  return translation ?? key;
}
