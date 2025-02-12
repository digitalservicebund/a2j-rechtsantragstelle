import { Context } from "~/domains/contexts";
import { Translations } from "~/services/translations/getTranslationByKey";

const EMPTY_ITEM_TRANSLATION_VALUE = "emptyValue";

export const getItemValueBox = (
  translations: Translations,
  userData: Context,
  fieldName: string,
) => {
  const itemValue = userData[fieldName] as string;

  // Check if a direct translation exists
  const directTranslation = translations[`${fieldName}.${itemValue}`];
  if (typeof directTranslation !== "undefined") {
    return directTranslation;
  }

  // Handle empty value translation
  if (!itemValue) {
    const emptyTranslation =
      translations[`${fieldName}.${EMPTY_ITEM_TRANSLATION_VALUE}`];
    if (typeof emptyTranslation !== "undefined") {
      return emptyTranslation;
    }
  }

  // Fallback to string replacement translation or the original item value
  return translations[`${fieldName}.value`] ?? itemValue;
};
