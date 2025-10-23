function formatDateObject(valueObj: Record<string, unknown>): string {
  const day = String(valueObj.day).padStart(2, "0");
  const month = String(valueObj.month).padStart(2, "0");
  const year = String(valueObj.year);
  return `${day}.${month}.${year}`;
}

function formatBooleanObject(value: Record<string, unknown>): string {
  const activeKeys = Object.entries(value)
    .filter(
      ([_, val]) =>
        val === true || val === "yes" || val === "ja" || val === "on",
    )
    .map(([key, _]) => key);

  return activeKeys.length > 0 ? activeKeys.join(", ") : "";
}

function formatObjectValue(value: object): string {
  if (Array.isArray(value)) {
    return value.length === 0 ? "" : value.join(", ");
  }

  const valueObj = value as Record<string, unknown>;

  // Check if this is a date object
  if (valueObj.day && valueObj.month && valueObj.year) {
    return formatDateObject(valueObj);
  }

  // Handle boolean-like objects
  return formatBooleanObject(valueObj);
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
  value: unknown,
  options?: Array<{ text: string; value: string }>,
): string {
  if (value == null) {
    return "";
  }

  let formattedValue: string;

  if (typeof value === "object" && value != null) {
    formattedValue = formatObjectValue(value);
  } else {
    // Handle empty strings first
    if (typeof value === "string" && value.trim() === "") {
      return "";
    }

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
