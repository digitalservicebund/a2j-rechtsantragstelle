import { z } from "zod";
import { type MultiFieldsValidationBaseSchema } from "~/domains/multiFieldsFlowValidation";

export function validateStopoverDuplicates(
  baseSchema: MultiFieldsValidationBaseSchema,
) {
  return baseSchema.superRefine((userData, ctx) => {
    const fieldsForValidation = [
      "ersterZwischenstopp",
      "zweiterZwischenstopp",
      "dritterZwischenstopp",
    ];

    const filledFields = fieldsForValidation
      .filter((fieldName) => userData[fieldName])
      .map((fieldName) => ({
        fieldName,
        value: userData[fieldName],
      }));

    for (const current of filledFields) {
      const duplicates = filledFields.filter(
        (other) =>
          other.fieldName !== current.fieldName &&
          other.value === current.value,
      );

      if (
        userData.startAirport === current.value ||
        userData.endAirport === current.value
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "initialFlightDuplicates",
          path: [current.fieldName],
        });
      }

      for (const duplicate of duplicates) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "stopoverDuplicates",
          path: [duplicate.fieldName],
        });
      }
    }
  });
}
