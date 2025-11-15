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
    .filter(
      ([_, val]) =>
        val === true || val === "yes" || val === "ja" || val === "on",
    )
    .map(([key, _]) => key);

  if (activeKeys.length === 0) {
    return "";
  }

  // if "none" is active, only show that (ignore other options)
  if (activeKeys.includes("none")) {
    const noneOption = options?.find((opt) => opt.value === "none");
    return noneOption ? noneOption.text : "none";
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
  return values.every(
    (val) =>
      val === "on" ||
      val === "off" ||
      val === true ||
      val === false ||
      val === "yes" ||
      val === "no" ||
      val === "ja" ||
      val === "nein",
  );
}

function formatObjectValue(
  value: object,
  options?: Array<{ text: string; value: string }>,
): string {
  if (Array.isArray(value)) {
    return "";
  }

  const valueObj = value as Record<string, unknown>;

  // Check if this is a date object: {day: '11', month: '11', year: '1991'}
  if (valueObj.day && valueObj.month && valueObj.year) {
    return formatDateObject(valueObj);
  }

  // Handle boolean group objects: {selbststaendig: 'on', festangestellt: 'off'}
  const values = Object.values(valueObj);
  if (isBooleanGroup(values)) {
    return formatBooleanObject(valueObj, options);
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
  value: unknown,
  options?: Array<{ text: string; value: string }>,
): string {
  if (value == null) {
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
