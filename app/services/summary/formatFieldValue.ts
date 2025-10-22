function formatDateObject(valueObj: Record<string, unknown>): string {
  const day = String(valueObj.day).padStart(2, "0");
  const month = String(valueObj.month).padStart(2, "0");
  const year = String(valueObj.year);
  return `${day}.${month}.${year}`;
}

function formatAddressObject(valueObj: Record<string, unknown>): string {
  const addressParts = [];

  if (valueObj.strasseHausnummer && String(valueObj.strasseHausnummer).trim()) {
    addressParts.push(String(valueObj.strasseHausnummer).trim());
  }

  if (valueObj.plz && valueObj.ort) {
    const plzOrt = `${String(valueObj.plz).trim()} ${String(valueObj.ort).trim()}`;
    addressParts.push(plzOrt);
  } else if (valueObj.plz && String(valueObj.plz).trim()) {
    addressParts.push(String(valueObj.plz).trim());
  } else if (valueObj.ort && String(valueObj.ort).trim()) {
    addressParts.push(String(valueObj.ort).trim());
  }

  if (valueObj.land && String(valueObj.land).trim()) {
    addressParts.push(String(valueObj.land).trim());
  }

  return addressParts.join(", ");
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

  // Check if this is an address object
  if (valueObj.strasseHausnummer || valueObj.plz || valueObj.ort) {
    return formatAddressObject(valueObj);
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

  if (typeof value === "object" && value !== null) {
    formattedValue = formatObjectValue(value);
  } else {
    formattedValue = String(value);

    // Handle empty strings
    if (typeof value === "string" && value.trim() === "") {
      return "";
    }
  }

  return translateWithOptions(formattedValue, options);
}
