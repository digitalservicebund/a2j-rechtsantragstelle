import { z } from "zod";
import type { FunctionMultiFieldsValidation } from "~/domains/types";
import type { SchemaObject } from "~/domains/userData";
import { isKeyOfObject } from "~/util/objects";
import { fieldIsArray, splitArrayName } from "../../array";

export function buildStepSchema(
  schemas: SchemaObject,
  fieldNames: string[],
  multiFieldsValidation?: FunctionMultiFieldsValidation,
): z.ZodObject<SchemaObject> {
  const fieldValidators: SchemaObject = {};

  for (const fieldName of fieldNames) {
    if (fieldIsArray(fieldName)) {
      const [arrayName, arrayFieldName] = splitArrayName(fieldName);
      const arraySchema = schemas[arrayName] as z.ZodArray<z.ZodObject>;
      const objectSchemas = arraySchema.element.shape as SchemaObject;
      if (!isKeyOfObject(arrayFieldName, objectSchemas)) {
        throw Error(`No schema found for ${arrayFieldName as string}`);
      }
      fieldValidators[fieldName] = objectSchemas[arrayFieldName];
    } else if (new RegExp(/\[\d+\]/).test(fieldName)) {
      const arrayName = fieldName.split("[")[0];
      fieldValidators[arrayName] = schemas[arrayName];
    } else {
      const stepOrFieldName = fieldName.split(".")[0];
      if (!isKeyOfObject(stepOrFieldName, schemas)) {
        throw Error(`No schema found for ${stepOrFieldName as string}`);
      }
      fieldValidators[stepOrFieldName] = schemas[stepOrFieldName];
    }
  }

  const validationFieldsSchema = z.object(fieldValidators);

  const validationSchema = multiFieldsValidation
    ? multiFieldsValidation(validationFieldsSchema)
    : validationFieldsSchema;

  return validationSchema;
}
