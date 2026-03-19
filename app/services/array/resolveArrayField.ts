import set from "lodash/set";
import type { UserData } from "~/domains/userData";

/**
 * Resolves a plain field name to its full lodash-style data path
 * using the array scope (collected from the tree) and URL indexes.
 *
 * Example:
 *   resolveArrayField("vorname", ["kinder"], [0])
 *   → "kinder[0].vorname"
 *
 *   resolveArrayField("name", ["kinder", "schulen"], [0, 1])
 *   → "kinder[0].schulen[1].name"
 */
export function resolveArrayField(
  fieldName: string,
  arrayFields: string[],
  indices: number[],
): string {
  const prefix = arrayFields
    .map((field, i) => `${field}[${indices[i]}]`)
    .join(".");
  return `${prefix}.${fieldName}`;
}

/**
 * Write-side counterpart: takes submitted form data with plain field names
 * and builds the correctly nested object using arrayFields and URL indexes.
 *
 * Example:
 *   resolveArrayFieldsFromKeys({ vorname: "Max" }, ["kinder"], [0])
 *   → { kinder: [{ vorname: "Max" }] }
 */
export function resolveArrayFieldsFromKeys(
  data: UserData,
  arrayFields: string[],
  arrayIndexes: number[],
): UserData {
  const resolved: UserData = {};
  for (const [key, value] of Object.entries(data)) {
    const path = resolveArrayField(key, arrayFields, arrayIndexes);
    set(resolved, path, value);
  }
  return resolved;
}
