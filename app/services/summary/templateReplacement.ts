import type { UserData } from "~/domains/userData";
import { parseArrayField } from "./fieldParsingUtils";

function replaceTemplateVariables(
  questionText: string,
  fieldName: string,
  userData: UserData,
): string {
  const fieldInfo = parseArrayField(fieldName);
  if (fieldInfo.isArraySubField) {
    const baseFieldName = fieldInfo.baseFieldName;
    const arrayIndex = fieldInfo.arrayIndex;
    const arrayData = userData[baseFieldName];

    if (Array.isArray(arrayData) && arrayData[arrayIndex]) {
      const arrayItem = arrayData[arrayIndex] as Record<string, unknown>;

      // Replace template variables like {{kind#vorname}}, {{kind#nachname}}
      return questionText.replaceAll(
        /\{\{(\w+)#(\w+)\}\}/g,
        (match: string, arrayType: string, fieldKey: string) => {
          if (
            arrayType === baseFieldName ||
            (arrayType === "kind" && baseFieldName === "kinder")
          ) {
            const value = arrayItem[fieldKey];
            if (value != null && typeof value !== "object") {
              const primitiveValue = value as string | number | boolean;
              return String(primitiveValue);
            }
            return match; // Keep original if no value found or value is object
          }
          return match;
        },
      );
    }
  }

  return questionText;
}

export function getUserDataFieldLabel(
  fieldName: string,
  fieldQuestions: Record<string, { question?: string }>,
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
