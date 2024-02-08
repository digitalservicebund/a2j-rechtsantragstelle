import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { isKeyOfObject } from "~/util/objects";
import { reasonsToDisplayBeratungshilfe } from "./beratungshilfe";
import type { GeldEinklagenFormularContext } from "./geldEinklagenFormular/context";
import type { GeldEinklagenVorabcheckContext } from "./geldEinklagen/context";
import type { BeratungshilfeVorabcheckContext } from "./beratungshilfe/context";
import type { FluggastrechtContext } from "./fluggastrechteFormular/context";
import { BeratungshilfeAntragContext } from "~/models/flows/beratungshilfeFormular";

export type AllContexts =
  | GeldEinklagenFormularContext
  | GeldEinklagenVorabcheckContext
  | BeratungshilfeVorabcheckContext
  | BeratungshilfeAntragContext
  | FluggastrechtContext;
type Schemas = Record<string, z.ZodTypeAny>;

export function buildStepValidator(schemas: Schemas, fieldNames: string[]) {
  const fieldSchemas: Record<string, z.ZodTypeAny> = {};

  for (const fieldname of fieldNames) {
    // In case of nested fields, we take the parent key
    const stepOrFieldName = fieldname.split(".")[0];
    if (!isKeyOfObject(stepOrFieldName, schemas)) {
      throw Error(`No schema found for ${stepOrFieldName as string}`);
    }
    fieldSchemas[stepOrFieldName] = schemas[stepOrFieldName];
  }
  return withZod(z.object(fieldSchemas));
}

export function getReasonsToDisplay(
  context: AllContexts,
): Record<string, boolean> {
  if ("rechtsschutzversicherung" in context) {
    return reasonsToDisplayBeratungshilfe(context);
  }
  return {};
}
