import type { UserData } from "~/domains/userData";
import { parseArrayField } from "./fieldParsingUtils";
import { fieldIsArray } from "~/services/array";

function isArrayField(fieldName: string, userData: UserData): boolean {
  const value = userData[fieldName];
  return Array.isArray(value) && value.length > 0;
}

function hasArrayFormFields(
  fieldName: string,
  fieldToStepMapping: Record<string, string>,
): boolean {
  // Check if there are any form fields that start with "fieldName#"
  return Object.keys(fieldToStepMapping).some(
    (mappedField) =>
      fieldIsArray(mappedField) && mappedField.startsWith(`${fieldName}#`),
  );
}

function getArraySubFields(
  baseFieldName: string,
  fieldToStepMapping: Record<string, string>,
): string[] {
  // Find all form fields that start with "baseFieldName#"
  const s = Object.keys(fieldToStepMapping)
    .filter(
      (field) => fieldIsArray(field) && field.startsWith(`${baseFieldName}#`),
    )
    .map((field) => field.split("#")[1]) // Extract the sub-field name after #
    .filter(Boolean);
  console.log(baseFieldName, s);
  return s;
}

export function expandArrayFields(
  fields: string[],
  userData: UserData,
  fieldToStepMapping: Record<string, string>,
): string[] {
  const expandedFields: string[] = [];

  for (const fieldName of fields) {
    const isArray = isArrayField(fieldName, userData);
    const hasArrayFields = hasArrayFormFields(fieldName, fieldToStepMapping);

    if (isArray && hasArrayFields) {
      // Expand array fields into sub-fields
      const arrayValue = userData[fieldName] as Array<Record<string, unknown>>;
      const subFields = getArraySubFields(fieldName, fieldToStepMapping);

      // Add each array item's sub-fields as separate fields
      for (let index = 0; index < arrayValue.length; index++) {
        const arrayItem = arrayValue[index] as Record<string, unknown>;
        for (const subField of subFields) {
          // Only add fields that actually exist in the userData
          if (arrayItem && subField in arrayItem) {
            const expandedField = `${fieldName}[${index}].${subField}`;
            expandedFields.push(expandedField);
          }
        }
      }
    } else {
      // Regular field or array without form mappings
      expandedFields.push(fieldName);
    }
  }

  return expandedFields;
}

export function getArrayItemValue(
  arrayFieldName: string,
  index: number,
  userData: UserData,
): Record<string, unknown> | null {
  const fieldInfo = parseArrayField(arrayFieldName);
  const baseFieldName = fieldInfo.baseFieldName;
  const arrayValue = userData[baseFieldName];
  // console.log("Array value", arrayValue);

  if (Array.isArray(arrayValue) && arrayValue[index]) {
    return arrayValue[index] as Record<string, unknown>;
  }

  return null;
}

export function createArrayEditUrl(
  arrayFieldName: string,
  representativeStepId: string,
): string {
  // Handle both "name[index]" and "name[index].subfield" patterns
  const fieldInfo = parseArrayField(arrayFieldName);

  if (fieldInfo.isArrayField) {
    // For array fields, we need to insert the array index in the correct position
    // Example: "/finanzielle-angaben/kinder/kinder/name" -> "/finanzielle-angaben/kinder/kinder/0/name"

    const pathParts = representativeStepId.split("/");

    if (pathParts.length >= 4) {
      // Insert array index before the last part (field name)
      const lastIndex = pathParts.length - 1;
      pathParts.splice(lastIndex, 0, fieldInfo.arrayIndex.toString());
      return `..${pathParts.join("/")}`;
    }

    // Fallback for simpler paths
    return `..${representativeStepId}/${fieldInfo.arrayIndex}`;
  }

  return `..${representativeStepId}`;
}
