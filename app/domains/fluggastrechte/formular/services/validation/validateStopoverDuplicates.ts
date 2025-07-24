import { z } from "zod";
import { type MultiFieldsValidationBaseSchema } from "~/domains/types";
import type { fluggastrechteInputSchema } from "../../userData";

const fieldsForValidation = [
  "ersterZwischenstopp",
  "zweiterZwischenstopp",
  "dritterZwischenstopp",
] as const;

export function validateStopoverDuplicates(
  baseSchema: MultiFieldsValidationBaseSchema<
    Pick<
      typeof fluggastrechteInputSchema,
      (typeof fieldsForValidation)[number] | "startAirport" | "endAirport"
    >
  >,
) {
  return baseSchema.superRefine((userData, ctx) => {
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
