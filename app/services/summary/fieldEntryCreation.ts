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
  flowId: string,
): FieldItem[] {
  return fields.map((fieldName) => {
    const stepId = findStepIdForField(fieldName, fieldToStepMapping);
    const fullStepId = stepId ? `${flowId}${stepId}` : "";

    return createFieldEntry(fieldName, userData, fieldQuestions, fullStepId);
  });
}
