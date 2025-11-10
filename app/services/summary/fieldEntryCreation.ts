import type { UserData } from "~/domains/userData";
import type { FieldItem } from "./types";
import { formatFieldValue } from "./formatFieldValue";
import { isUserDataFieldEmpty } from "./fieldValidation";
import { getUserDataFieldLabel } from "./templateReplacement";
import { getArrayItemValue, createArrayEditUrl } from "./arrayFieldProcessing";
import { parseArrayField } from "./fieldParsingUtils";
import { findStepIdForField } from "./getFormQuestions";

export function createFieldEntry(
  fieldName: string,
  userData: UserData,
  fieldQuestions: Record<
    string,
    { question?: string; options?: Array<{ text: string; value: string }> }
  >,
  representativeStepId: string,
): FieldItem {
  const fieldInfo = parseArrayField(fieldName);
  const isArrayItem = fieldInfo.isArrayField;
  const isArraySubFieldFlag = fieldInfo.isArraySubField;

  let value: unknown;
  let actualFieldName = fieldName;
  let arrayIndex: number | undefined;
  let arrayBaseField: string | undefined;

  if (isArraySubFieldFlag) {
    arrayIndex = fieldInfo.arrayIndex;
    arrayBaseField = fieldInfo.baseFieldName;

    const arrayItem = getArrayItemValue(
      `${fieldInfo.baseFieldName}[${fieldInfo.arrayIndex}]`,
      fieldInfo.arrayIndex,
      userData,
    );
    value =
      arrayItem && fieldInfo.subFieldName
        ? arrayItem[fieldInfo.subFieldName]
        : null;
    actualFieldName = fieldName;
  } else {
    value = userData[fieldName];
  }

  const isEmpty = isUserDataFieldEmpty(value);
  const question = getUserDataFieldLabel(
    actualFieldName,
    fieldQuestions,
    userData,
  );
  const fieldQuestion = fieldQuestions[actualFieldName];

  const answer = isEmpty
    ? "Keine Angabe" // need to get this from CMS for translations
    : formatFieldValue(value, fieldQuestion?.options);

  let editUrl: string | undefined;
  if (representativeStepId) {
    if (isArrayItem) {
      editUrl = createArrayEditUrl(fieldName, representativeStepId);
    } else {
      editUrl = representativeStepId;
    }
  } else {
    editUrl = undefined;
  }

  return {
    id: crypto.randomUUID().split("-")[0],
    question,
    answer,
    editUrl,
    isArrayItem,
    arrayIndex,
    arrayBaseField,
  };
}

export function processBoxFields(
  fields: string[],
  userData: UserData,
  fieldQuestions: Record<
    string,
    { question?: string; options?: Array<{ text: string; value: string }> }
  >,
  fieldToStepMapping: Record<string, string>,
): FieldItem[] {
  if (fields.length === 0) {
    return [];
  }
  // Find representative stepId for edit URLs
  // For array fields, try to find the first step in the array flow
  const representativeField = fields[0];
  const representativeStepId = findStepIdForField(
    representativeField,
    fieldToStepMapping,
  );

  // Skip boxes that don't have a real stepId
  if (!representativeStepId) {
    return [];
  }

  return fields.map((fieldName) =>
    createFieldEntry(fieldName, userData, fieldQuestions, representativeStepId),
  );
}
