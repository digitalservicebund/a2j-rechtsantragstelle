import type { UserData } from "~/domains/userData";

const EXCLUDED_FIELDS_USERDATA = new Set(["pageData"]);

export function getValidUserDataFields(userData: UserData): string[] {
  const expandedFields: string[] = [];

  for (const [fieldName, value] of Object.entries(userData)) {
    if (EXCLUDED_FIELDS_USERDATA.has(fieldName) || value === undefined) {
      continue;
    }

    // Add the main field
    expandedFields.push(fieldName);

    // If it's an object (but not array or date), also add nested fields for form question lookup
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !(value.day && value.month && value.year) // Not a date object
    ) {
      const obj = value as Record<string, unknown>;
      for (const key of Object.keys(obj)) {
        expandedFields.push(`${fieldName}.${key}`);
      }
    }
  }

  return expandedFields;
}
