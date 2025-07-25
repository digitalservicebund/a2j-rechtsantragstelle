import { type UserData } from "~/domains/userData";
import { arrayChar } from "~/services/array";
import { type Translations } from "~/services/translations/getTranslationByKey";

const getNestedValue = (userData: UserData, fieldName: string): string => {
  const [nestedObjectName, nestedValueName] = fieldName.split(".");
  const nestedObject = userData[nestedObjectName];

  if (typeof nestedObject === "object") {
    return (nestedObject as Record<string, string>)[nestedValueName] ?? "";
  }

  return "";
};

const getFieldName = (field: string): string => {
  if (field.includes(arrayChar)) {
    const parts = field.split(arrayChar);
    return parts[parts.length - 1];
  }
  return field;
};

export const getItemValueBox = (
  translations: Translations,
  userData: UserData,
  inlineItems: Array<{ field: string; emptyValuePlaceholder?: string }>,
) => {
  const itemValues = inlineItems.map(({ field, emptyValuePlaceholder }) => {
    const fieldName = getFieldName(field);
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
      (itemValue === undefined ||
        (typeof itemValue === "string" && itemValue.length === 0)) &&
      typeof emptyValuePlaceholder !== "undefined" &&
      emptyValuePlaceholder.length > 0
    ) {
      return emptyValuePlaceholder;
    }

    // Fallback to string replacement translation or the original item value
    return translations[`${fieldName}.value`] ?? itemValue;
  });

  return itemValues.filter(Boolean).join(" ");
};
