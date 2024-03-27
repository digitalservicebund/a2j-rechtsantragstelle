import type { Translations } from "~/services/cms/index.server";

export function getTranslationByKey(
  translationKey: string,
  translationRecord: Translations,
): string {
  const translation = translationRecord[translationKey];

  if (typeof translation === "undefined") {
    console.error(
      `Key translation ${translationKey} is not available in the translation record. Please take a look in the CMS system!`,
    );
    return translationKey;
  }

  return translation;
}
