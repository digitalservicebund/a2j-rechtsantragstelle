import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { getContext } from "~/domains/contexts";
import { parsePathname } from "~/domains/flowIds";
import { isKeyOfObject } from "~/util/objects";
import { fieldIsArray, splitArrayName } from "../array";
import { getArrivalTimeDelayValidator } from "./getArrivalTimeDelayValidator";

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

  return getSpecialFieldValidators(fieldValidators, fieldNames);
}

export function validatorForFieldnames(fieldNames: string[], pathname: string) {
  const context = getContext(parsePathname(pathname).flowId);
  return buildStepValidator(context, fieldNames);
}

function getSpecialFieldValidators(
  fieldValidators: Record<string, z.ZodTypeAny>,
  fieldNames: string[],
) {
  const baseSchema = z.object(fieldValidators);

  if (fieldNames.includes("tatsaechlicherAnkunftsDatum")) {
    return withZod(getArrivalTimeDelayValidator(baseSchema));
  }

  return withZod(baseSchema);
}
