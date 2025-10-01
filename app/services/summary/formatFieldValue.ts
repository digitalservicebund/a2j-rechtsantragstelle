import type { Translations } from "~/services/translations/getTranslationByKey";

export function formatFieldValue(
  value: unknown,
  fieldName: string,
  componentType: string,
  translations?: Translations,
): string {
  if (isFieldEmpty(value, componentType)) {
    return "";
  }

  // Handle complex objects by extracting meaningful values
  let itemValue: string;
  if (typeof value === "object" && value !== null) {
    if (Array.isArray(value)) {
      itemValue = value.join(", ");
    } else {
      // For objects like {unterhaltszahlungen: true, arbeitlosengeld: false},
      // show only the true values as a comma-separated list
      const activeKeys = Object.entries(value)
        .filter(([_, val]) => val === true || val === "yes" || val === "ja")
        .map(([key, _]) => key);
      itemValue = activeKeys.length > 0 ? activeKeys.join(", ") : "";
    }
  } else {
    itemValue = String(value);
  }

  // Check if a direct translation exists for this field value
  if (translations) {
    const directTranslation = translations[`${fieldName}.${itemValue}`];
    if (typeof directTranslation !== "undefined") {
      return directTranslation;
    }

    // Check for fallback string replacement translation
    const fallbackTranslation = translations[`${fieldName}.value`];
    if (typeof fallbackTranslation !== "undefined") {
      return fallbackTranslation;
    }
  }

  // Return the processed value
  return itemValue;
}

export function isFieldEmpty(value: unknown, componentType: string): boolean {
  // Handle null and undefined
  if (value == null) {
    return true;
  }

  // Handle objects - check if they have any truthy values
  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      // For objects, check if any value is truthy
      return !Object.values(value).some(
        (val) => val === true || val === "yes" || val === "ja",
      );
    }
  }

  // Handle different component types
  switch (componentType) {
    case "form-elements.checkbox":
      // For checkboxes, consider unchecked ("no", false) as empty
      return value === "no" || value === false || value === "";

    case "form-elements.select":
    case "form-elements.dropdown":
    case "form-elements.tile-group":
      // For selection components, empty string or no selection is empty
      return value === "" || value === null || value === undefined;

    case "form-elements.input":
    case "form-elements.textarea":
    case "form-elements.auto-suggest-input":
    case "form-elements.date-input":
    case "form-elements.hidden-input":
    default:
      // For text inputs, empty or whitespace-only strings are empty
      return typeof value === "string" ? value.trim() === "" : !value;
  }
}
