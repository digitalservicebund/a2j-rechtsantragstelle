import type { MultiFieldsValidationBaseSchema } from "~/domains/types";
import type { fluggastrechteVorabcheckInputSchema } from "../userData";

const fieldsToValidate = ["startAirport", "endAirport"] as const;

export function validateSameDepartureAndArrivalAirports(
  baseSchema: MultiFieldsValidationBaseSchema<
    Pick<
      typeof fluggastrechteVorabcheckInputSchema,
      (typeof fieldsToValidate)[number]
    >
  >,
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
