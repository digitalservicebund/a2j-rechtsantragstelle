import type { ArrayFieldInfo, ArrayFieldSegment } from "./types";

const arraySegmentPattern = /^(.+)\[(\d+)\]$/;

/**
 * Parses array field names like "kinder[0]", "kinder[0].vorname", nested arrays
 * such as "kinder[0].kinder[2].vorname", or regular fields like "vorname"
 *
 * @param fieldName - Field name to parse
 * @returns Parsed field information
 *
 * @example
 * parseArrayField("vorname") → { baseFieldName: "vorname", arrayIndex: -1, isArrayField: false, isArraySubField: false, segments: [] }
 * parseArrayField("kinder[0]") → { baseFieldName: "kinder", arrayIndex: 0, isArrayField: true, isArraySubField: false, segments: [{ fieldName: "kinder", arrayIndex: 0 }] }
 * parseArrayField("kinder[0].vorname") → { baseFieldName: "kinder", arrayIndex: 0, subFieldName: "vorname", isArrayField: true, isArraySubField: true, segments: [{ fieldName: "kinder", arrayIndex: 0 }] }
 * parseArrayField("kinder[0].kinder[2].vorname") → { baseFieldName: "kinder", arrayIndex: 0, subFieldName: "vorname", isArrayField: true, isArraySubField: true, segments: [{ fieldName: "kinder", arrayIndex: 0 }, { fieldName: "kinder", arrayIndex: 2 }] }
 */
export function parseArrayField(fieldName: string): ArrayFieldInfo {
  const isArrayField = fieldName.includes("[") && fieldName.includes("]");

  if (!isArrayField) {
    return {
      baseFieldName: fieldName,
      arrayIndex: -1,
      isArrayField: false,
      isArraySubField: false,
      segments: [],
    };
  }

  // Walk each "." part, collecting one segment per "name[index]" array level.
  // Any remaining, non-bracketed part is the leaf sub-field name.
  const segments: ArrayFieldSegment[] = [];
  let subFieldName: string | undefined;

  for (const part of fieldName.split(".")) {
    const match = arraySegmentPattern.exec(part);
    if (match) {
      segments.push({
        fieldName: match[1],
        arrayIndex: Number.parseInt(match[2], 10),
      });
    } else {
      subFieldName = part;
    }
  }

  const [{ fieldName: baseFieldName, arrayIndex }] = segments;

  return {
    baseFieldName,
    arrayIndex,
    subFieldName,
    isArrayField: true,
    isArraySubField: subFieldName !== undefined,
    segments,
  };
}

/**
 * Creates box key for grouping array fields (e.g., "kinder[0].vorname" → "kinder-0",
 * "kinder[0].kinder[2].vorname" → "kinder-0-kinder-2")
 */
export function createArrayBoxKey(fieldName: string): string | null {
  const info = parseArrayField(fieldName);

  if (info.isArrayField) {
    return info.segments.map((s) => `${s.fieldName}-${s.arrayIndex}`).join("-");
  }

  return null;
}

/**
 * Builds the "#"-joined field-to-step-mapping key prefix for an array field's
 * segments (e.g. "kinder[0].kinder[2]" → "kinder#kinder#"), matching the
 * mapping convention used for nested array form fields.
 */
export function buildArrayKeyPrefix(fieldInfo: ArrayFieldInfo): string {
  return fieldInfo.segments.map((segment) => segment.fieldName).join("#");
}
