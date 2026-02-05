import type { AllowedUserTypes, UserData } from "~/domains/userData";
import { parseArrayField } from "./fieldParsingUtils";
import mustache from "mustache";

function createArrayReplacements(
  fieldName: string,
  userData: UserData,
): UserData | undefined {
  const fieldInfo = parseArrayField(fieldName);
  if (!fieldInfo.isArraySubField) {
    return undefined;
  }

  const baseFieldName = fieldInfo.baseFieldName;
  const arrayIndex = fieldInfo.arrayIndex;
  const arrayData = userData[baseFieldName];

  if (!Array.isArray(arrayData) || !arrayData[arrayIndex]) {
    return undefined;
  }

  const arrayItem = arrayData[arrayIndex];

  // Change "kinder" to "kind", because the string replacement coming from strapi has kind
  // And userdata has kinder, so inorder for mustache to work we need to unify the data
  const replacements: UserData = {};
  const kindKey = baseFieldName === "kinder" ? "kind" : baseFieldName;
  replacements[kindKey] = arrayItem as AllowedUserTypes;

  return replacements;
}

export function getUserDataFieldLabel(
  fieldName: string,
  fieldQuestions: Record<string, { question?: string }>,
  userData?: UserData,
): string {
  const question = fieldQuestions[fieldName]?.question;

  if (question && userData) {
    const arrayReplacements = createArrayReplacements(fieldName, userData);
    if (arrayReplacements) {
      // Convert {{kind#field}} pattern to {{kind.field}} for mustache
      const mustacheQuestion = question.replaceAll("#", ".");
      return mustache.render(mustacheQuestion, arrayReplacements);
    }
  }

  return question ?? fieldName;
}
