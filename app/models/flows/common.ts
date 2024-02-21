import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { isKeyOfObject } from "~/util/objects";
import { reasonsToDisplayBeratungshilfe } from "./beratungshilfe";
import type { GeldEinklagenFormularContext } from "./geldEinklagenFormular/context";
import type { GeldEinklagenVorabcheckContext } from "./geldEinklagen/context";
import type { BeratungshilfeVorabcheckContext } from "./beratungshilfe/context";
import type { FluggastrechtContext } from "./fluggastrechteFormular/context";
import type { BeratungshilfeFormularContext } from "./beratungshilfeFormular";
import { fieldIsArray, splitArrayName } from "~/util/arrayVariable";

export type AllContexts =
  | GeldEinklagenFormularContext
  | GeldEinklagenVorabcheckContext
  | BeratungshilfeVorabcheckContext
  | BeratungshilfeFormularContext
  | FluggastrechtContext;
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

export function getReasonsToDisplay(
  context: AllContexts,
): Record<string, boolean> {
  if ("rechtsschutzversicherung" in context) {
    return reasonsToDisplayBeratungshilfe(context);
  }
  return {};
}
