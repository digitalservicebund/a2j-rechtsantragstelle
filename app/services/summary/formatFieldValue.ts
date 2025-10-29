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

  // Special case: if "none" is active, only show that (ignore other options)
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

function formatArrayItemObject(
  valueObj: Record<string, unknown>,
  baseFieldName?: string,
  allFieldQuestions?: Record<
    string,
    { question?: string; options?: Array<{ text: string; value: string }> }
  >,
): string {
  // For array items, create a summary of non-empty fields
  const summaryParts: string[] = [];

  for (const [key, val] of Object.entries(valueObj)) {
    if (val != null && val !== "") {
      // Look up options for this specific array sub-field
      const arrayFieldKey = baseFieldName
        ? `${baseFieldName}#${key}`
        : undefined;
      const fieldOptions =
        arrayFieldKey && allFieldQuestions
          ? allFieldQuestions[arrayFieldKey]?.options
          : undefined;

      if (typeof val === "object" && val != null) {
        // Handle nested objects
        if (Array.isArray(val)) {
          if (val.length > 0) {
            summaryParts.push(`${key}: ${val.join(", ")}`);
          }
        } else {
          const nestedObj = val as Record<string, unknown>;
          if (nestedObj.day && nestedObj.month && nestedObj.year) {
            summaryParts.push(`${key}: ${formatDateObject(nestedObj)}`);
          } else {
            const boolResult = formatBooleanObject(nestedObj);
            if (boolResult) {
              summaryParts.push(`${key}: ${boolResult}`);
            }
          }
        }
      } else {
        // Apply options translation if available
        const translatedValue = translateWithOptions(String(val), fieldOptions);
        summaryParts.push(`${key}: ${translatedValue}`);
      }
    }
  }

  return summaryParts.join(", ");
}

function formatObjectValue(
  value: object,
  baseFieldName?: string,
  allFieldQuestions?: Record<
    string,
    { question?: string; options?: Array<{ text: string; value: string }> }
  >,
  fieldOptions?: Array<{ text: string; value: string }>,
): string {
  if (Array.isArray(value)) {
    return value.length === 0 ? "" : value.join(", ");
  }

  const valueObj = value as Record<string, unknown>;

  // Check if this is a date object
  if (valueObj.day && valueObj.month && valueObj.year) {
    return formatDateObject(valueObj);
  }

  // Check if this looks like an array item object vs checkbox group
  const keys = Object.keys(valueObj);
  const values = Object.values(valueObj);

  // If all values are boolean-like ("on"/"off", true/false, "yes"/"no"), treat as checkbox group
  const isBooleanGroup = values.every(val =>
    val === "on" || val === "off" || val === true || val === false ||
    val === "yes" || val === "no" || val === "ja" || val === "nein"
  );

  if (isBooleanGroup) {
    // Handle boolean-like objects - use field options if available, otherwise try to get from allFieldQuestions
    const optionsToUse =
      fieldOptions || allFieldQuestions?.[baseFieldName || ""]?.options;
    return formatBooleanObject(valueObj, optionsToUse);
  }

  // For multi-property objects, format each property using its component options and labels
  if (keys.length > 1 && allFieldQuestions) {
    const formattedParts: string[] = [];

    for (const [key, val] of Object.entries(valueObj)) {
      if (val != null && val !== "") {
        // Look up component question/label and options for this specific field
        // Try both the direct key and the full path (baseFieldName.key)
        const fullFieldPath = baseFieldName ? `${baseFieldName}.${key}` : key;
        const fieldQuestion = allFieldQuestions[key] || allFieldQuestions[fullFieldPath];
        const fieldLabel = fieldQuestion?.question || key;
        const fieldOptions = fieldQuestion?.options;

        if (typeof val === "object" && val != null) {
          // Handle nested objects recursively
          const nestedFormatted = formatObjectValue(val, key, allFieldQuestions);
          if (nestedFormatted) {
            formattedParts.push(`${fieldLabel}: ${nestedFormatted}`);
          }
        } else {
          // Apply options translation to value if available
          const translatedValue = translateWithOptions(String(val), fieldOptions);
          formattedParts.push(`${fieldLabel}: ${translatedValue}`);
        }
      }
    }

    return formattedParts.join(", ");
  }

  // Fallback to array item formatting for objects without allFieldQuestions
  if (keys.length > 1) {
    return formatArrayItemObject(valueObj, baseFieldName, allFieldQuestions);
  }

  // Handle single-property boolean-like objects
  const optionsToUse =
    fieldOptions || allFieldQuestions?.[baseFieldName || ""]?.options;
  return formatBooleanObject(valueObj, optionsToUse);
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
  baseFieldName?: string,
  allFieldQuestions?: Record<
    string,
    { question?: string; options?: Array<{ text: string; value: string }> }
  >,
): string {
  if (value == null) {
    return "";
  }

  let formattedValue: string;

  if (typeof value === "object" && value != null) {
    formattedValue = formatObjectValue(
      value,
      baseFieldName,
      allFieldQuestions,
      options,
    );
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
