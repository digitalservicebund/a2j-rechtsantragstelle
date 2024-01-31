import { withZod } from "@remix-validated-form/with-zod";
import { ZodArray, ZodObject, ZodTypeAny, z } from "zod";
import { isKeyOfObject } from "~/util/objects";
import { reasonsToDisplayBeratungshilfe } from "./beratungshilfe";
import type { GeldEinklagenFormularContext } from "./geldEinklagenFormular/context";
import type { GeldEinklagenVorabcheckContext } from "./geldEinklagen/context";
import type { BeratungshilfeVorabcheckContext } from "./beratungshilfe/context";
import type { FluggastrechtContext } from "./fluggastrechteFormular/context";

export type AllContexts =
  | GeldEinklagenFormularContext
  | GeldEinklagenVorabcheckContext
  | BeratungshilfeVorabcheckContext
  | FluggastrechtContext;
type Schemas = Record<string, z.ZodTypeAny>;

export function buildStepValidator(schemas: Schemas, fieldNames: string[]) {
  const fieldValidators: Record<string, z.ZodTypeAny> = {};

  for (const fieldname of fieldNames) {
    // In case of nested fields, we take the parent key
    // if fieldname contains []
    if (fieldname.includes("[]")) {
      // then destructure
      const fieldnameArray = fieldname.split("[].")[0];
      const fieldnameProperty = fieldname.split("[].")[1];
      const zodArray = schemas[fieldnameArray] as z.ZodArray<z.ZodTypeAny>;
      const zodElement = zodArray.element as z.ZodObject<any>;
      fieldValidators[fieldnameArray] = zodElement.shape[
        fieldnameProperty
      ] as z.ZodTypeAny;
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
