import { withZod } from "@remix-validated-form/with-zod";
import type { ZodObject, ZodOptional, ZodTypeAny } from "zod";
import { z } from "zod";
import { getContext } from "~/flows/contexts";
import { parsePathname } from "~/flows/flowIds";
import { isKeyOfObject } from "~/util/objects";
import { fieldIsArray, splitArrayName } from "../array";

type Schemas = Record<string, z.ZodTypeAny>;

export function buildStepValidator(schemas: Schemas, fieldNames: string[]) {
  const fieldValidators: Record<string, z.ZodTypeAny> = {};

  for (const fieldname of fieldNames) {
    if (fieldIsArray(fieldname)) {
      const [arrayName, arrayFieldname] = splitArrayName(fieldname);
      // need to check for arrays nested in objects
      if (arrayName.includes(".")) {
        schemas = flattenNestedObject(arrayName, schemas);
      }
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

function flattenNestedObject(arrayName: string, schemas: Schemas) {
  const arrayParent = arrayName.split(".")[0];
  const objSchema = schemas[arrayParent] as ZodObject<any>;
  return {
    ...schemas,
    ...Object.fromEntries(
      Object.entries(objSchema.shape).map(([key, value]: [string, any]) => [
        `${arrayParent}.${key}`,
        (value as ZodOptional<ZodTypeAny>).unwrap(),
      ]),
    ),
  };
}

export function validatorForFieldnames(fieldNames: string[], pathname: string) {
  const context = getContext(parsePathname(pathname).flowId);
  return buildStepValidator(context, fieldNames);
}
