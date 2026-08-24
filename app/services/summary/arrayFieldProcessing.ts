import type { ArrayData, UserData } from "~/domains/userData";
import { parseArrayField } from "./fieldParsingUtils";
import { arrayIsNonEmpty } from "~/util/array";
import { fieldIsArray } from "~/services/array";

function hasArrayFormFields(
  fieldNamePrefix: string,
  fieldToStepMapping: Record<string, string>,
): boolean {
  // Check if there are any form fields that start with "fieldName#"
  return Object.keys(fieldToStepMapping).some(
    (mappedField) =>
      fieldIsArray(mappedField) && mappedField.startsWith(fieldNamePrefix),
  );
}

// Sub-field names directly under `keyPrefix` (e.g. "kinder#" or "kinder#kinder#").
// Deeper "#"-segments belong to a nested array and are resolved by a further
// recursive call, not flattened here.
function getImmediateSubFieldNames(
  keyPrefix: string,
  fieldToStepMapping: Record<string, string>,
): string[] {
  const subFieldNames: string[] = [];

  for (const key of Object.keys(fieldToStepMapping)) {
    if (!key.startsWith(keyPrefix)) continue;

    const [subFieldName] = key.slice(keyPrefix.length).split("#");
    if (subFieldName && !subFieldNames.includes(subFieldName)) {
      subFieldNames.push(subFieldName);
    }
  }

  return subFieldNames;
}

// Expands an array field (and any arrays nested within its items, e.g. Kinder
// with their own Kinder) into concrete paths like "kinder[0].kinder[2].vorname".
function expandArrayFieldItems(
  fieldName: string,
  keyPrefix: string,
  arrayValue: ArrayData,
  fieldToStepMapping: Record<string, string>,
): string[] {
  const subFieldNames = getImmediateSubFieldNames(
    keyPrefix,
    fieldToStepMapping,
  );
  const expandedFields: string[] = [];

  arrayValue.forEach((arrayItem, index) => {
    if (!arrayItem) return;
    const itemPath = `${fieldName}[${index}]`;

    for (const subFieldName of subFieldNames) {
      if (!(subFieldName in arrayItem)) continue;

      const subValue = arrayItem[subFieldName] as ArrayData;
      const subKeyPrefix = `${keyPrefix}${subFieldName}#`;
      const isNestedArray =
        Array.isArray(subValue) &&
        arrayIsNonEmpty(subValue) &&
        hasArrayFormFields(subKeyPrefix, fieldToStepMapping);

      if (isNestedArray) {
        expandedFields.push(
          ...expandArrayFieldItems(
            `${itemPath}.${subFieldName}`,
            subKeyPrefix,
            subValue,
            fieldToStepMapping,
          ),
        );
      } else {
        expandedFields.push(`${itemPath}.${subFieldName}`);
      }
    }
  });

  return expandedFields;
}

export function expandArrayFields(
  fields: string[],
  userData: UserData,
  fieldToStepMapping: Record<string, string>,
): string[] {
  const expandedFields: string[] = [];

  for (const fieldName of fields) {
    const fieldValue = userData[fieldName] as ArrayData;
    const isArray = Array.isArray(fieldValue) && arrayIsNonEmpty(fieldValue);
    const hasArrayFields = hasArrayFormFields(
      `${fieldName}#`,
      fieldToStepMapping,
    );

    if (isArray && hasArrayFields) {
      const arrayExpandedFields = expandArrayFieldItems(
        fieldName,
        `${fieldName}#`,
        fieldValue,
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

export function createArrayEditUrl(
  arrayFieldName: string,
  representativeStepId: string,
): string {
  const fieldInfo = parseArrayField(arrayFieldName);

  if (!fieldInfo.isArrayField) {
    return representativeStepId;
  }

  // Array edit URLs: remove last 2 segments and add "uebersicht"
  // "/path/to/collection/item/details" → "/path/to/collection/uebersicht"
  const pathParts = representativeStepId.split("/");
  return pathParts.slice(0, -2).join("/") + "/uebersicht";
}
