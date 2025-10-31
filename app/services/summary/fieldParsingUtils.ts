/**
 * Utility functions for parsing array field names consistently across the summary system
 */

export type ArrayFieldInfo = {
  baseFieldName: string;
  arrayIndex: number;
  subFieldName?: string;
  isArrayField: boolean;
  isArraySubField: boolean;
};

/**
 * Parses array field names like "kinder[0]", "kinder[0].vorname", or regular fields like "vorname"
 *
 * @param fieldName - Field name to parse
 * @returns Parsed field information
 *
 * @example
 * parseArrayField("vorname") → { baseFieldName: "vorname", arrayIndex: -1, isArrayField: false, isArraySubField: false }
 * parseArrayField("kinder[0]") → { baseFieldName: "kinder", arrayIndex: 0, isArrayField: true, isArraySubField: false }
 * parseArrayField("kinder[0].vorname") → { baseFieldName: "kinder", arrayIndex: 0, subFieldName: "vorname", isArrayField: true, isArraySubField: true }
 */
export function parseArrayField(fieldName: string): ArrayFieldInfo {
  const isArrayField = fieldName.includes("[") && fieldName.includes("]");
  const isArraySubField = isArrayField && fieldName.includes(".");

  if (!isArrayField) {
    return {
      baseFieldName: fieldName,
      arrayIndex: -1,
      isArrayField: false,
      isArraySubField: false,
    };
  }

  // Handle array sub-fields like "kinder[0].vorname"
  if (isArraySubField) {
    const [arrayPart, subFieldName] = fieldName.split(".");
    const [baseFieldName, indexPart] = arrayPart.split("[");
    const indexStr = indexPart.replace("]", "");
    const arrayIndex = parseInt(indexStr, 10);

    return {
      baseFieldName,
      arrayIndex,
      subFieldName,
      isArrayField: true,
      isArraySubField: true,
    };
  }

  // Handle simple array fields like "kinder[0]"
  const [baseFieldName, indexPart] = fieldName.split("[");
  const indexStr = indexPart.replace("]", "");
  const arrayIndex = parseInt(indexStr, 10);

  return {
    baseFieldName,
    arrayIndex,
    isArrayField: true,
    isArraySubField: false,
  };
}

/**
 * Creates array field key for mapping lookups (e.g., "kinder[0].vorname" → "kinder#vorname")
 */
export function createArrayFieldKey(fieldName: string): string {
  const info = parseArrayField(fieldName);

  if (info.isArraySubField && info.subFieldName) {
    return `${info.baseFieldName}#${info.subFieldName}`;
  }

  return fieldName;
}

/**
 * Creates box key for grouping array fields (e.g., "kinder[0].vorname" → "kinder-0")
 */
export function createArrayBoxKey(fieldName: string): string | null {
  const info = parseArrayField(fieldName);

  if (info.isArrayField) {
    return `${info.baseFieldName}-${info.arrayIndex}`;
  }

  return null;
}

/**
 * Checks if a field is an array field
 */
export function isArrayField(fieldName: string): boolean {
  return parseArrayField(fieldName).isArrayField;
}

/**
 * Checks if a field is an array sub-field
 */
export function isArraySubField(fieldName: string): boolean {
  return parseArrayField(fieldName).isArraySubField;
}
