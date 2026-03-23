import z from "zod";
import { extractZodDescription } from "~/components/formElements/schemaToForm/renderSchemaBasedFormElement";
import { type AllowedUserTypes, type SchemaObject } from "~/domains/userData";
import { ibanZodDescription } from "~/services/validation/iban";

export const specialFieldsToEncode = new Set([ibanZodDescription]);

export function processSpecialFieldDisplay<T extends AllowedUserTypes>(
  value: T,
  schema?: SchemaObject[string],
): T {
  const schemaDescription = extractZodDescription(schema ?? z.NEVER);
  if (schemaDescription && specialFieldsToEncode.has(schemaDescription)) {
    return schema?.encode(value) as T;
  }
  return value;
}
