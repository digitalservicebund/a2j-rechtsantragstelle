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
    // Handle special placeholder field for "Keine Angabe" sections
    if (fieldName === "placeholder") {
      return emptyValuePlaceholder || "Keine Angabe";
    }

    const rawValue = fieldName.includes(".")
      ? getNestedValue(userData, fieldName)
      : userData[fieldName];

    // Handle different value types properly
    let itemValue: string;
    if (typeof rawValue === "object" && rawValue !== null) {
      if (Array.isArray(rawValue)) {
        itemValue = rawValue.join(", ");
      } else {
        // For objects like {unterhaltszahlungen: true, arbeitlosengeld: false},
        // show only the true values
        const activeKeys = Object.entries(rawValue)
          .filter(([_, val]) => val === true || val === "yes" || val === "ja" || val === "on")
          .map(([key, _]) => key);
        itemValue = activeKeys.length > 0 ? activeKeys.join(", ") : "";
      }
    } else {
      itemValue = String(rawValue || "");
    }

    // Debug logging for auto-generated content (after processing)
    if (fieldName === "berufart" || fieldName === "weitereseinkommen") {
      console.log("🔍 Debug getItemValueBox:", {
        fieldName,
        rawValue,
        type: typeof rawValue,
        itemValue,  // ← Now shows processed value
        emptyValuePlaceholder,
        translationKey: `${fieldName}.${itemValue}`,  // ← Now shows correct key
        translation: translations[`${fieldName}.${itemValue}`]
      });
    }

    // Handle special "none" case for checkbox groups
    if (itemValue === "none") {
      return "Nein, trifft nicht zu";
    }

    // Check if a direct translation exists
    const directTranslation = translations[`${fieldName}.${itemValue}`];
    if (typeof directTranslation !== "undefined") {
      return directTranslation;
    }

    // Handle empty value
    if (
      !itemValue &&
      typeof emptyValuePlaceholder !== "undefined" &&
      emptyValuePlaceholder.length > 0
    ) {
      return emptyValuePlaceholder;
    }

    // Fallback to string replacement translation or the original item value
    return translations[`${fieldName}.value`] ?? itemValue;
  });

  const result = itemValues.filter(Boolean).join(" ");

  // Debug final result for auto-generated content
  if (inlineItems.some(item => item.field === "berufart" || item.field === "weitereseinkommen")) {
    console.log("🔍 Final getItemValueBox result:", {
      itemValues,
      filteredValues: itemValues.filter(Boolean),
      finalResult: result,
      isEmpty: result.trim() === ""
    });
  }

  return result;
};
