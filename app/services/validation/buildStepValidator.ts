import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { getContext } from "~/domains/contexts";
import type { FlowId } from "~/domains/flowIds";
import { parsePathname } from "~/domains/flowIds";
import { isKeyOfObject } from "~/util/objects";
import { fieldIsArray, splitArrayName } from "../array";
import {
  getArrivalDateValidator,
  getArrivalTimeDelayValidator,
} from "./getArrivalTimeDelayValidator";

type Schemas = Record<string, z.ZodTypeAny>;

export function buildStepValidator(
  schemas: Schemas,
  fieldNames: string[],
  flowId: FlowId,
) {
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

  return getValidatorsWithSpecialFieldValidatorsOrDefault(
    fieldValidators,
    fieldNames,
    flowId,
  );
}

export function validatorForFieldnames(fieldNames: string[], pathname: string) {
  const flowId = parsePathname(pathname).flowId;
  const context = getContext(flowId);
  return buildStepValidator(context, fieldNames, flowId);
}

function getValidatorsWithSpecialFieldValidatorsOrDefault(
  fieldValidators: Record<string, z.ZodTypeAny>,
  fieldNames: string[],
  flowId: FlowId,
) {
  const baseSchema = z.object(fieldValidators);

  if (flowId !== "/fluggastrechte/formular") return withZod(baseSchema);

  const hasArrivalDate = fieldNames.includes("tatsaechlicherAnkunftsDatum");
  const hasArrivalTime = fieldNames.includes("tatsaechlicherAnkunftsZeit");

  const hasRequiredFields = hasArrivalDate && hasArrivalTime;

  if (!hasRequiredFields) return withZod(baseSchema);

  const mergedSchema = z.intersection(
    getArrivalTimeDelayValidator(baseSchema),
    getArrivalDateValidator(baseSchema),
  );

  return withZod(mergedSchema);
}
