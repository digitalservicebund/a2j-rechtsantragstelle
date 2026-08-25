import type { UserData } from "~/domains/userData";
import type { FieldItem } from "./types";
import { formatFieldValue } from "./formatFieldValue";
import { createArrayEditUrl } from "./arrayFieldProcessing";
import { createArrayBoxKey, parseArrayField } from "./fieldParsingUtils";
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

// Walks every nested array segment (e.g. kinder[0].kinder[2]) to find the item
// the leaf sub-field lives on.
function resolveArrayItem(
  userData: UserData,
  segments: ReturnType<typeof parseArrayField>["segments"],
): UserData | undefined {
  let container: UserData = userData;
  let item: UserData | undefined;

  for (const segment of segments) {
    const arrayValue = container[segment.fieldName];
    item = Array.isArray(arrayValue)
      ? (arrayValue[segment.arrayIndex] as UserData | undefined)
      : undefined;
    if (!item) return undefined;
    container = item;
  }

  return item;
}

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
  const arrayItem = resolveArrayItem(userData, fieldInfo.segments);

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

  // Full index path across every nesting level (e.g. [0, 2] for kinder[0].kinder[2])
  const arrayIndexes = fieldInfo.segments.map((segment) => segment.arrayIndex);
  const arrayBoxKey = isArrayItem
    ? (createArrayBoxKey(fieldName) ?? undefined)
    : undefined;

  return {
    id: crypto.randomUUID().split("-")[0],
    question: applyStringReplacementToContent(
      question,
      representativeStepId,
      userData,
      arrayIndexes.length > 0 ? arrayIndexes : undefined,
    ),
    answer: applyStringReplacementToContent(
      answer,
      representativeStepId,
      userData,
      arrayIndexes.length > 0 ? arrayIndexes : undefined,
    ),
    editUrl,
    isArrayItem,
    arrayIndex,
    arrayBaseField,
    arrayBoxKey,
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
