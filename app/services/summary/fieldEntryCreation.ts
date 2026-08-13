import type { UserData } from "~/domains/userData";
import type { FieldItem } from "./types";
import { formatFieldValue } from "./formatFieldValue";
import { createArrayEditUrl } from "./arrayFieldProcessing";
import { parseArrayField } from "./fieldParsingUtils";
import { findStepIdForField } from "./getFormQuestions";
import { getPageAndFlowDataFromPathname } from "../flow/getPageAndFlowDataFromPathname";
import {
  applyStringReplacement,
  replacementsFromFlowConfig,
} from "~/util/applyStringReplacement";
import { addPageDataToUserData } from "../flow/pageData";

const applyStringReplacementToContent = (
  content: string,
  stepId: string,
  userData: UserData,
  arrayIndexes: number[] | undefined = undefined,
) => {
  if (!content.includes("{{")) {
    return content;
  }

  if (!stepId) {
    return content;
  }

  const userDataWithPageData = addPageDataToUserData(userData, {
    arrayIndexes,
  });

  try {
    const { currentFlow } = getPageAndFlowDataFromPathname(stepId);

    const replacements = replacementsFromFlowConfig(
      currentFlow.stringReplacements,
      userDataWithPageData,
    );

    return applyStringReplacement(content, replacements);
  } catch {
    return content;
  }
};

const getValueAndArrayData = (
  fieldInfo: ReturnType<typeof parseArrayField>,
  userData: UserData,
  fieldName: string,
) => {
  if (!fieldInfo.isArrayField) {
    return { value: userData[fieldName] };
  }

  const arrayIndex = fieldInfo.arrayIndex;
  const arrayBaseField = fieldInfo.baseFieldName;

  const arrayValue = userData[fieldInfo.baseFieldName];
  const arrayItem =
    Array.isArray(arrayValue) && arrayValue[fieldInfo.arrayIndex]
      ? arrayValue[fieldInfo.arrayIndex]
      : undefined;

  const value =
    arrayItem && fieldInfo.subFieldName
      ? arrayItem[fieldInfo.subFieldName]
      : undefined;

  return { value, arrayIndex, arrayBaseField };
};

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

  const { value, arrayIndex, arrayBaseField } = getValueAndArrayData(
    fieldInfo,
    userData,
    fieldName,
  );

  const question = fieldQuestions[fieldName]?.question ?? fieldName;
  const fieldQuestion = fieldQuestions[fieldName];

  const answer =
    value == undefined || value === ""
      ? "Keine Angabe" // need to get this from CMS for translations
      : formatFieldValue(value, fieldQuestion?.options);

  const editUrl = isArrayItem
    ? createArrayEditUrl(fieldName, representativeStepId)
    : representativeStepId;

  return {
    id: crypto.randomUUID().split("-")[0],
    question: applyStringReplacementToContent(
      question,
      representativeStepId,
      userData,
      arrayIndex === undefined ? undefined : [arrayIndex],
    ),
    answer: applyStringReplacementToContent(
      answer,
      representativeStepId,
      userData,
      arrayIndex === undefined ? undefined : [arrayIndex],
    ),
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
