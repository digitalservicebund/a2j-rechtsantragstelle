import type { UserData } from "~/domains/userData";
import { formatFieldValue } from "./formatFieldValue";
import { isUserDataFieldEmpty } from "./fieldValidation";
import { getUserDataFieldLabel } from "./templateReplacement";
import { getArrayItemValue, createArrayEditUrl } from "./arrayFieldProcessing";
import { parseArrayField, isArrayField } from "./fieldParsingUtils";

export function createFieldEntry(
  fieldName: string,
  userData: UserData,
  fieldQuestions: Record<
    string,
    { question?: string; options?: Array<{ text: string; value: string }> }
  >,
  representativeStepId: string,
): {
  question: string;
  answer: string;
  editUrl?: string;
  isArrayItem?: boolean;
  arrayIndex?: number;
  arrayBaseField?: string;
} {
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
    ? "Keine Angabe"
    : formatFieldValue(
        value,
        fieldQuestion?.options,
        arrayBaseField || fieldName,
        fieldQuestions,
      );

  const editUrl = representativeStepId
    ? isArrayItem
      ? createArrayEditUrl(fieldName, representativeStepId)
      : `..${representativeStepId}`
    : undefined;

  return {
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
): Array<{ question: string; answer: string; editUrl?: string }> {
  if (fields.length === 0) {
    return [];
  }

  // Find representative stepId for edit URLs
  // For array fields, try to find the first step in the array flow (usually 'name' or similar)
  let representativeField = fields[0];
  let representativeStepId = fieldToStepMapping[representativeField];

  // For array fields, look for a better representative field (like 'name' which is usually first)
  const isArrayFields = fields[0] ? isArrayField(fields[0]) : false;
  if (isArrayFields) {
    const nameField = fields.find(
      (field) =>
        field.includes(".vorname") ||
        field.includes(".name") ||
        field.includes(".nachname"),
    );
    if (nameField && fieldToStepMapping[nameField]) {
      representativeField = nameField;
      representativeStepId = fieldToStepMapping[nameField];
    }
  }

  // Skip boxes that don't have a real stepId
  if (!representativeStepId) {
    return [];
  }

  return fields.map((fieldName) =>
    createFieldEntry(fieldName, userData, fieldQuestions, representativeStepId),
  );
}
