import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { isKeyOfObject } from "~/util/objects";
import type { StrapiElementWithId } from "~/services/cms/models/StrapiElementWithId";
import { reasonsToDisplayBeratungshilfe } from "../beratungshilfe";

type Context = Record<string, string>;
type Schemas = Record<string, z.ZodTypeAny>;

export function buildStepValidator(schemas: Schemas, fieldNames: string[]) {
  const fieldSchemas: Record<string, z.ZodTypeAny> = {};

  for (const fieldname of fieldNames) {
    // In case of nested fields, we take the parent key
    const stepOrFieldName = fieldname.split(".")[0];
    if (!isKeyOfObject(stepOrFieldName, schemas)) {
      throw Error(`No schema found for ${stepOrFieldName}`);
    }
    fieldSchemas[stepOrFieldName] = schemas[stepOrFieldName];
  }
  return withZod(z.object(fieldSchemas));
}

export function getReasonsToDisplay(
  reasons: StrapiElementWithId[],
  context: Context,
) {
  const reasonsToDisplay = reasonsToDisplayBeratungshilfe(context);
  return reasons.filter((reason) =>
    isKeyOfObject(reason.elementId, reasonsToDisplay),
  );
}
