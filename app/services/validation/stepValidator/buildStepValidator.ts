import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import type { FunctionMultiFieldsValidation } from "~/domains/multiFieldsFlowValidation";
import { isKeyOfObject } from "~/util/objects";
import { fieldIsArray, splitArrayName } from "../../array";

type Schemas = Record<string, z.ZodTypeAny>;

export function buildStepValidator(
  schemas: Schemas,
  fieldNames: string[],
  multiFieldsValidation?: FunctionMultiFieldsValidation,
) {
  const fieldValidators: Record<string, z.ZodTypeAny> = {};

  for (const fieldName of fieldNames) {
    if (fieldIsArray(fieldName)) {
      const [arrayName, arrayFieldName] = splitArrayName(fieldName);
      const arraySchema = schemas[arrayName] as z.ZodArray<z.AnyZodObject>;
      const objectSchemas = arraySchema.element.shape as Schemas;
      if (!isKeyOfObject(arrayFieldName, objectSchemas)) {
        throw Error(`No schema found for ${arrayFieldName as string}`);
      }
      fieldValidators[fieldName] = objectSchemas[arrayFieldName];
    } else {
      const stepOrFieldName = fieldName.split(".")[0];
      if (!isKeyOfObject(stepOrFieldName, schemas)) {
        throw Error(`No schema found for ${stepOrFieldName as string}`);
      }
      fieldValidators[stepOrFieldName] = schemas[stepOrFieldName];
    }
  }

  const baseSchema = z.object(fieldValidators);

  const validationSchema = multiFieldsValidation
    ? multiFieldsValidation(baseSchema)
    : baseSchema;

  return withZod(validationSchema);
}
