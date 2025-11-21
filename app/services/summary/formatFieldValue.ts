import type { AllowedUserTypes, ObjectType } from "~/domains/userData";

function formatDateObject(valueObj: Record<string, unknown>): string {
  const day = String(valueObj.day).padStart(2, "0");
  const month = String(valueObj.month).padStart(2, "0");
  const year = String(valueObj.year);
  return `${day}.${month}.${year}`;
}

function formatBooleanObject(
  value: Record<string, unknown>,
  options?: Array<{ text: string; value: string }>,
): string {
  const activeKeys = Object.entries(value)
    .filter(([_, val]) => val === "on")
    .map(([key, _]) => key);

  if (activeKeys.length === 0) {
    return "";
  }

  // Translate active keys using options if available
  if (options && options.length > 0) {
    const translatedKeys = activeKeys.map((key) => {
      const matchingOption = options.find((opt) => opt.value === key);
      return matchingOption ? matchingOption.text : key;
    });
    return translatedKeys.join(", ");
  }

  return activeKeys.join(", ");
}

function isBooleanGroup(values: unknown[]): boolean {
  return values.every((val) => val === "on" || val === "off");
}

function formatObjectValue(
  value: ObjectType,
  options?: Array<{ text: string; value: string }>,
): string {
  if (Array.isArray(value)) {
    return "";
  }

  // Check if this is a date object: {day: '11', month: '11', year: '1991'}
  if (value.day && value.month && value.year) {
    return formatDateObject(value);
  }

  // Handle boolean group objects: {selbststaendig: 'on', festangestellt: 'off'}
  const values = Object.values(value);
  if (isBooleanGroup(values)) {
    return formatBooleanObject(value, options);
  }

  // Fallback for unknown object types
  return "";
}

function translateWithOptions(
  value: string,
  options?: Array<{ text: string; value: string }>,
): string {
  if (!options || options.length === 0) {
    return value;
  }

  const matchingOption = options.find((opt) => opt.value === value);
  return matchingOption ? matchingOption.text : value;
}

export function formatFieldValue(
  value: AllowedUserTypes,
  options?: Array<{ text: string; value: string }>,
): string {
  if (value == null || Array.isArray(value)) {
    return "";
  }

  let formattedValue: string;

  if (typeof value === "object" && value != null) {
    formattedValue = formatObjectValue(value, options);
  } else {
    // Handle empty strings
    if (typeof value === "string" && value.trim() === "") {
      return "";
    }

    // Convert primitives to string
    if (typeof value === "string") {
      formattedValue = value;
    } else if (typeof value === "number" || typeof value === "boolean") {
      formattedValue = String(value);
    } else {
      formattedValue = "";
    }
  }

  return translateWithOptions(formattedValue, options);
}
