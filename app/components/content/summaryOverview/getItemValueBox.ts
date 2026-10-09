import type {
  FieldItems,
  InlineItems,
} from "~/components/content/summaryOverview/types";
import type { AllowedUserTypes, UserData } from "~/domains/userData";
import { arrayChar } from "~/services/array";
import { type Translations } from "~/services/translations/getTranslationByKey";
import {
  toTimeString,
  type TimeObject,
} from "~/services/validation/timeObject";

const isItemValueTimeObject = (
  itemValue: AllowedUserTypes,
): itemValue is TimeObject => {
  return (
    typeof itemValue === "object" &&
    "hour" in itemValue &&
    "minute" in itemValue
  );
};

const getNestedValue = (userData: UserData, fieldName: string): string => {
  const [nestedObjectName, nestedValueName] = fieldName.split(".");
  const nestedObject = userData[nestedObjectName];

  if (isItemValueTimeObject(nestedObject)) {
    return toTimeString(nestedObject);
  }

  if (typeof nestedObject === "object") {
    return (nestedObject as Record<string, string>)[nestedValueName] ?? "";
  }

  return "";
};

const getFieldName = (field: string): string =>
  field.split(arrayChar).pop() ?? field;

export const extractFieldItemsFromInlineItems = (
  userData: UserData,
  inlineItems: InlineItems,
): FieldItems =>
  inlineItems.map(({ field }) => {
    const fieldName = getFieldName(field);
    const fieldValue = fieldName.includes(".")
      ? getNestedValue(userData, fieldName)
      : userData[fieldName];

    return { fieldName: field, fieldValue };
  });

export const getItemValueBox = (
  translations: Translations,
  userData: UserData,
  inlineItems: InlineItems,
) => {
  const itemValues = inlineItems.map(({ field, emptyValuePlaceholder }) => {
    const fieldName = getFieldName(field);
    const fieldValueType = typeof userData[fieldName];
    const itemValue =
      fieldName.includes(".") || fieldValueType === "object"
        ? getNestedValue(userData, fieldName)
        : userData[fieldName];

    // Check if a direct translation exists
    const directTranslation = translations[`${fieldName}.${itemValue}`];
    if (directTranslation) return directTranslation;

    // Handle empty value
    if (!itemValue && emptyValuePlaceholder) return emptyValuePlaceholder;

    // Fallback to string replacement translation or the original item value
    return translations[`${fieldName}.value`] ?? itemValue;
  });

  return itemValues.filter(Boolean).join(" ");
};
