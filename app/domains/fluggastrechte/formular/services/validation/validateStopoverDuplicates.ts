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
  return baseSchema.check((ctx) => {
    const filledFields = fieldsForValidation
      .filter((fieldName) => ctx.value[fieldName])
      .map((fieldName) => ({
        fieldName,
        value: ctx.value[fieldName],
      }));

    for (const current of filledFields) {
      const duplicates = filledFields.filter(
        (other) =>
          other.fieldName !== current.fieldName &&
          other.value === current.value,
      );

      if (
        ctx.value.startAirport === current.value ||
        ctx.value.endAirport === current.value
      ) {
        ctx.issues.push({
          code: "custom",
          message: "initialFlightDuplicates",
          path: [current.fieldName],
          input: current.value,
        });
      }

      for (const duplicate of duplicates) {
        ctx.issues.push({
          code: "custom",
          message: "stopoverDuplicates",
          path: [duplicate.fieldName],
          input: duplicate.value,
        });
      }
    }
  });
}
