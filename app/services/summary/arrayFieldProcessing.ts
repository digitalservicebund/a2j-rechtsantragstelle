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
  return Object.keys(fieldToStepMapping)
    .filter(
      (field) => fieldIsArray(field) && field.startsWith(`${baseFieldName}#`),
    )
    .map((field) => field.split("#")[1]) // Extract the sub-field name after #
    .filter(Boolean);
}

function expandArrayFieldItems(
  fieldName: string,
  userData: UserData,
  fieldToStepMapping: Record<string, string>,
): string[] {
  const arrayValue = userData[fieldName] as Array<Record<string, unknown>>;
  const subFields = getArraySubFields(fieldName, fieldToStepMapping);
  const expandedFields: string[] = [];

  for (let index = 0; index < arrayValue.length; index++) {
    const arrayItem = arrayValue[index];
    for (const subField of subFields) {
      // Only add fields that actually exist in the userData
      if (arrayItem && subField in arrayItem) {
        const expandedField = `${fieldName}[${index}].${subField}`;
        expandedFields.push(expandedField);
      }
    }
  }

  return expandedFields;
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
      const arrayExpandedFields = expandArrayFieldItems(
        fieldName,
        userData,
        fieldToStepMapping,
      );
      expandedFields.push(...arrayExpandedFields);
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

  if (Array.isArray(arrayValue) && arrayValue[index]) {
    return arrayValue[index] as Record<string, unknown>;
  }

  return null;
}

const FIELD_TO_PATH_MAPPING: Record<string, string> = {
  wertsachen: "wertgegenstaende",
  weitereEinkuenfte: "weitere-einkuenfte",
};

export function createArrayEditUrl(
  arrayFieldName: string,
  representativeStepId: string,
): string {
  // Handle both "name[index]" and "name[index].subfield" patterns
  const fieldInfo = parseArrayField(arrayFieldName);

  if (fieldInfo.isArrayField) {
    const pathParts = representativeStepId.split("/");
    const baseFieldName = fieldInfo.baseFieldName;

    let mappedFieldName = baseFieldName;

    // Apply field name mapping if needed
    if (FIELD_TO_PATH_MAPPING[baseFieldName]) {
      mappedFieldName = FIELD_TO_PATH_MAPPING[baseFieldName];
    }

    // Look for exact match first
    let basePathIndex = pathParts.indexOf(mappedFieldName);

    // Then try parts that contain the base field name
    if (basePathIndex === -1) {
      basePathIndex = pathParts.findIndex((part) =>
        part.includes(mappedFieldName),
      );
    }

    // Build the correct overview URL
    if (basePathIndex !== -1) {
      return pathParts.slice(0, basePathIndex + 1).join("/") + "/uebersicht";
    }

    return representativeStepId;
  }

  return representativeStepId;
}
