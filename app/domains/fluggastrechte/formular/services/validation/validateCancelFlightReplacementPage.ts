import { z } from "zod";
import { MultiFieldsValidationBaseSchema } from "~/domains/multiFieldsFlowValidation";
import { isFieldEmptyOrUndefined } from "~/util/isFieldEmptyOrUndefined";

export function validateCancelFlightReplacementPage(
  baseSchema: MultiFieldsValidationBaseSchema,
) {
  return baseSchema.superRefine((data, ctx) => {
    const fieldsForValidation = [
      "annullierungErsatzverbindungFlugnummer",
      "annullierungErsatzverbindungAbflugsDatum",
      "annullierungErsatzverbindungAbflugsZeit",
      "annullierungErsatzverbindungAnkunftsDatum",
      "annullierungErsatzverbindungAnkunftsZeit",
    ];

    const fields = fieldsForValidation.map((path) => ({
      value: data[path],
      path: [path],
    }));

    const isAnyFieldFilled = fields.some(
      ({ value }) => !isFieldEmptyOrUndefined(value),
    );

    if (isAnyFieldFilled) {
      for (const { value, path } of fields) {
        if (isFieldEmptyOrUndefined(value)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "fillAllOrNone",
            path,
          });
        }
      }
    }
  });
}
