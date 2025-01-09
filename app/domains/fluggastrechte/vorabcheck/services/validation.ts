import { z } from "zod";
import type { MultiFieldsValidationBaseSchema } from "~/domains/multiFieldsFlowValidation";

export function validateSameDepartureAndArrivalAirports(
  baseSchema: MultiFieldsValidationBaseSchema,
) {
  const fieldsToValidate = ["startAirport", "endAirport"];

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
