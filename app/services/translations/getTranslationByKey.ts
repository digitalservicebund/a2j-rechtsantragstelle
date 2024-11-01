import { sendSentryMessage } from "~/services/logging";

export type Translations = Record<string, string>;

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

export function extractTranslations<T extends string>(
  keys: T[],
  translations?: Translations,
) {
  return Object.fromEntries(
    keys.map((key) => [key, getTranslationByKey(key, translations)]),
  ) as Record<T, string>;
}
