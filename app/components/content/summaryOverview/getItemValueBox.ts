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

const getFieldName = (field: string): string =>
  field.split(arrayChar).pop() ?? field;

const isDateObject = (
  value: unknown,
): value is { day: number; month: number; year: number } => {
  return (
    typeof value === "object" &&
    value !== null &&
    "day" in value &&
    "month" in value &&
    "year" in value
  );
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
      : userData[fieldName];

    if (isDateObject(itemValue)) {
      return `${itemValue.day}.${itemValue.month}.${itemValue.year}`;
    }
    // Make sure itemValue is a string
    const displayValue =
      typeof itemValue === "string" || typeof itemValue === "number"
        ? String(itemValue)
        : "";

    // Check if a direct translation exists
    const directTranslation = translations[`${fieldName}.${displayValue}`];
    if (directTranslation) return directTranslation;

    // Handle empty value
    if (!displayValue && emptyValuePlaceholder) return emptyValuePlaceholder;

    // Fallback to string replacement translation or the original item value
    return translations[`${fieldName}.value`] ?? displayValue;
  });

  return itemValues.filter(Boolean).join(" ");
};
