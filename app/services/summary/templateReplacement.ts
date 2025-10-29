import type { UserData } from "~/domains/userData";
import { parseArrayField } from "./fieldParsingUtils";

function replaceTemplateVariables(
  questionText: string,
  fieldName: string,
  userData: UserData,
): string {
  // Handle array field template replacement like {{kind#vorname}} in "kinder[0].unterhalt"
  const fieldInfo = parseArrayField(fieldName);
  if (fieldInfo.isArraySubField) {
    const baseFieldName = fieldInfo.baseFieldName;
    const arrayIndex = fieldInfo.arrayIndex;
    const arrayData = userData[baseFieldName];

    // Replace {{array#index}} with actual array index (1-based)
    let result = questionText.replace(
      /\{\{array#index\}\}/g,
      String(arrayIndex + 1),
    );

    if (Array.isArray(arrayData) && arrayData[arrayIndex]) {
      const arrayItem = arrayData[arrayIndex] as Record<string, unknown>;

      // Replace template variables like {{kind#vorname}} and {{kind#nachname}}
      result = result.replace(
        /\{\{(\w+)#(\w+)\}\}/g,
        (match, arrayType, fieldKey) => {
          // Handle both "kind" and "kinder" for backwards compatibility
          if (
            arrayType === baseFieldName ||
            (arrayType === "kind" && baseFieldName === "kinder")
          ) {
            const value = arrayItem[fieldKey];
            return value ? String(value) : match; // Keep original if no value found
          }
          return match;
        },
      );
    }

    return result;
  }

  return questionText;
}

export function getUserDataFieldLabel(
  fieldName: string,
  fieldQuestions: Record<string, { question?: string; pageTitle?: string }>,
  userData?: UserData,
): string {
  const question = fieldQuestions[fieldName]?.question;

  if (question && userData) {
    return replaceTemplateVariables(question, fieldName, userData);
  }

  if (question) {
    return question;
  }

  return fieldName;
}

export function getUserDataFieldPageTitle(
  fieldName: string,
  fieldQuestions: Record<string, { question?: string; pageTitle?: string }>,
  userData?: UserData,
): string | undefined {
  const pageTitle = fieldQuestions[fieldName]?.pageTitle;

  if (pageTitle && userData) {
    return replaceTemplateVariables(pageTitle, fieldName, userData);
  }

  return pageTitle;
}
