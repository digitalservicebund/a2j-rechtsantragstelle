import { type AllowedUserTypes, type SchemaObject } from "~/domains/userData";
import { ibanZodDescription } from "~/services/validation/iban";

export const specialFieldsToEncode = new Set([ibanZodDescription]);

export function processSpecialFieldDisplay<T extends AllowedUserTypes>(
  value: T,
  schema: SchemaObject[string],
): T {
  if (schema.description && specialFieldsToEncode.has(schema.description)) {
    return schema.encode(value) as T;
  }
  return value;
}
