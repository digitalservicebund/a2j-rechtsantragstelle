import type { UserData } from "~/domains/userData";
import { formatFieldValue } from "./formatFieldValue";

const EXCLUDED_FIELDS_USERDATA = new Set(["pageData"]);

export function isUserDataFieldEmpty(value: unknown): boolean {
  // Only consider null, undefined, or empty strings as empty
  // All other values (including "no", false, 0) are considered answered
  return value == null || value === "";
}

export function getUserDataFieldLabel(
  fieldName: string,
  fieldQuestions: Record<string, { question?: string }>,
): string {
  const question = fieldQuestions[fieldName]?.question;

  if (question) {
    return question;
  }

  return fieldName;
}

export function getValidUserDataFields(userData: UserData): string[] {
  return Object.keys(userData).filter(
    (fieldName) =>
      !EXCLUDED_FIELDS_USERDATA.has(fieldName) &&
      userData[fieldName] !== undefined,
  );
}

export function createFieldEntry(
  fieldName: string,
  userData: UserData,
  fieldQuestions: Record<
    string,
    { question?: string; options?: Array<{ text: string; value: string }> }
  >,
  representativeStepId: string,
): { question: string; answer: string; editUrl?: string } {
  const value = userData[fieldName];
  const isEmpty = isUserDataFieldEmpty(value);

  const question = getUserDataFieldLabel(fieldName, fieldQuestions);
  const fieldQuestion = fieldQuestions[fieldName];
  const answer = isEmpty
    ? "Keine Angabe"
    : formatFieldValue(value, fieldQuestion?.options);
  const editUrl = representativeStepId
    ? `..${representativeStepId}`
    : undefined;

  return { question, answer, editUrl };
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
  const representativeField = fields[0];
  const representativeStepId = fieldToStepMapping[representativeField];

  // Skip boxes that don't have a real stepId
  if (!representativeStepId) {
    return [];
  }

  return fields.map((fieldName) =>
    createFieldEntry(fieldName, userData, fieldQuestions, representativeStepId),
  );
}
