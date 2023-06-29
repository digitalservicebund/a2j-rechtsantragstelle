import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { isKeyOfObject } from "~/util/objects";
import type { StrapiElementWithId } from "~/services/cms/models/StrapiElementWithId";
import { isIncomeTooHigh } from "./beratungshilfe/guards";

type Context = Record<string, string>;
type Schemas = Record<string, z.ZodTypeAny>;

export function buildStepValidator(schemas: Schemas, fieldNames: string[]) {
  const fieldSchemas: Record<string, z.ZodTypeAny> = {};
  for (const fieldname of fieldNames) {
    if (!isKeyOfObject(fieldname, schemas)) {
      throw Error(`No schema found for ${fieldname}`);
    }
    fieldSchemas[fieldname] = schemas[fieldname];
  }
  return withZod(z.object(fieldSchemas));
}

export const getReasonsToDisplay = (
  reasons: { attributes: StrapiElementWithId }[] | null,
  context: Context
) => {
  return reasons
    ?.filter((reason) => {
      // TODO use reusable conditions for this
      switch (reason.attributes.elementId) {
        case "eigeninitiativeWarning":
          return context.eigeninitiative === "no";
        case "incomeTooHigh":
          return (
            context.verfuegbaresEinkommen === "yes" || isIncomeTooHigh(context)
          );
        default:
          return false;
      }
    })
    .map((reason) => reason.attributes);
};
