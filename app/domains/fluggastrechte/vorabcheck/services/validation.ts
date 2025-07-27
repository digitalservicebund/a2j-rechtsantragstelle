import { z } from "zod";
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
  return baseSchema.superRefine((data, ctx) => {
    if (data.startAirport === data.endAirport) {
      fieldsToValidate.forEach((field) =>
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "sameDepartureAndArrivalAirports",
          path: [field],
          fatal: true,
        }),
      );
    }
  });
}
