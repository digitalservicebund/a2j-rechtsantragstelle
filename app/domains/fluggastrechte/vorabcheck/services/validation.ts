import type { MultiFieldsValidationBaseSchema } from "~/domains/types";
import { fluggastrechteVorabcheckPages } from "../pages";

const fieldsToValidate = ["startAirport", "endAirport"] as const;
const _schema = fluggastrechteVorabcheckPages.flughaefen.pageSchema;

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
