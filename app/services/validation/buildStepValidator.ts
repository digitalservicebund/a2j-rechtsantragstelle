import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { getContext, type Schemas } from "~/domains/contexts";
// import type { FlowId } from "~/domains/flowIds";
import { parsePathname } from "~/domains/flowIds";
import { isKeyOfObject } from "~/util/objects";
import { fieldIsArray, splitArrayName } from "../array";
// import {
//   getArrivalDateValidator,
//   getArrivalTimeDelayValidator,
// } from "./getArrivalTimeDelayValidator";

export function buildStepValidator(schemas: Schemas, fieldNames: string[]) {
  const fieldValidators: Record<string, z.ZodTypeAny> = {};
  const refinements = [];

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

      const { compoundValidations } = schemas;
      if (compoundValidations && stepOrFieldName in compoundValidations) {
        refinements.push(compoundValidations[stepOrFieldName]);
      }
    }
  }

  let zodObject = z.object(fieldValidators);
  refinements.forEach((refinement) => {
    zodObject = zodObject.refine(...refinement);
  });

  return withZod(zodObject);
}

export function validatorForFieldnames(fieldNames: string[], pathname: string) {
  const flowId = parsePathname(pathname).flowId;
  const context = getContext(flowId);
  return buildStepValidator(context, fieldNames);
}

// function getValidatorsWithSpecialFieldValidatorsOrDefault(
//   fieldValidators: Schemas,
//   fieldNames: string[],
//   flowId: FlowId,
// ) {
//   const baseSchema = z.object(fieldValidators);

//   if (flowId !== "/fluggastrechte/formular") return withZod(baseSchema);

//   const hasArrivalDate = fieldNames.includes("tatsaechlicherAnkunftsDatum");
//   const hasArrivalTime = fieldNames.includes("tatsaechlicherAnkunftsZeit");

//   const hasRequiredFields = hasArrivalDate && hasArrivalTime;

//   if (!hasRequiredFields) return withZod(baseSchema);

//   const mergedSchema = z.intersection(
//     getArrivalTimeDelayValidator(baseSchema),
//     getArrivalDateValidator(baseSchema),
//   );

//   return withZod(mergedSchema);
// }
