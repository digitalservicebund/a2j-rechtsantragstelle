import { Context } from "~/domains/contexts";
import { Translations } from "~/services/translations/getTranslationByKey";

const getNestedValue = (userData: Context, fieldName: string): string => {
  const [nestedObjectName, nestedValueName] = fieldName.split(".");
  const nestedObject = userData[nestedObjectName];

  if (typeof nestedObject === "object") {
    return (nestedObject as Record<string, string>)[nestedValueName] ?? "";
  }

  return "";
};

export const getItemValueBox = (
  translations: Translations,
  userData: Context,
  fieldName: string,
  displayEmptyValue?: string,
) => {
  const itemValue = fieldName.includes(".")
    ? getNestedValue(userData, fieldName)
    : (userData[fieldName] as string);

  // Check if a direct translation exists
  const directTranslation = translations[`${fieldName}.${itemValue}`];
  if (typeof directTranslation !== "undefined") {
    return directTranslation;
  }

  // Handle empty value
  if (
    typeof itemValue === "string" &&
    itemValue.length === 0 &&
    typeof displayEmptyValue !== "undefined" &&
    displayEmptyValue.length > 0
  ) {
    return displayEmptyValue;
  }

  // Fallback to string replacement translation or the original item value
  return translations[`${fieldName}.value`] ?? itemValue;
};
