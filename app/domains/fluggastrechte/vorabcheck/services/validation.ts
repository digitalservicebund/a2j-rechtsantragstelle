import type { MultiFieldsValidationBaseSchema } from "~/domains/types";
import { getAllPageSchemaByFlowId } from "~/domains/pageSchemas";

const fieldsToValidate = ["startAirport", "endAirport"] as const;
const _schema = getAllPageSchemaByFlowId("/fluggastrechte/vorabcheck");

export function validateSameDepartureAndArrivalAirports(
  baseSchema: MultiFieldsValidationBaseSchema<typeof _schema>,
) {
  return baseSchema.check((ctx) => {
    if (ctx.value.startAirport === ctx.value.endAirport) {
      fieldsToValidate.forEach((field) =>
        ctx.issues.push({
          code: "custom",
          message: "sameDepartureAndArrivalAirports",
          path: [field],
          fatal: true,
          input: ctx.value[field],
        }),
      );
    }
  });
}
