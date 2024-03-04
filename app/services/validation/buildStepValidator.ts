import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { fieldIsArray, splitArrayName } from "~/util/arrayVariable";
import { isKeyOfObject } from "~/util/objects";
import { flowIDFromPathname, getContext } from "~/models/flows/contexts";

type Schemas = Record<string, z.ZodTypeAny>;

export function buildStepValidator(schemas: Schemas, fieldNames: string[]) {
  const fieldValidators: Record<string, z.ZodTypeAny> = {};

  for (const fieldname of fieldNames) {
    if (fieldIsArray(fieldname)) {
      const [arrayName, arrayFieldname] = splitArrayName(fieldname);
      const arraySchema = schemas[arrayName] as z.ZodArray<z.AnyZodObject>;
      const objectSchemas = arraySchema.element.shape as Schemas;
      if (!isKeyOfObject(arrayFieldname, objectSchemas)) {
        throw Error(`No schema found for ${arrayFieldname as string}`);
      }
      fieldValidators[fieldname] = objectSchemas[arrayFieldname];
    } else {
      const stepOrFieldName = fieldname.split(".")[0];
      if (!isKeyOfObject(stepOrFieldName, schemas)) {
        throw Error(`No schema found for ${stepOrFieldName as string}`);
      }
      fieldValidators[stepOrFieldName] = schemas[stepOrFieldName];
    }
  }
  return withZod(z.object(fieldValidators));
}

export function validatorForFieldnames(fieldNames: string[], pathname: string) {
  const context = getContext(flowIDFromPathname(pathname));
  return buildStepValidator(context, fieldNames);
}
