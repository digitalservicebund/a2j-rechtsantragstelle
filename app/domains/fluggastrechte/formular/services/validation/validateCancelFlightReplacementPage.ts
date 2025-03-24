import { z } from "zod";
import { MultiFieldsValidationBaseSchema } from "~/domains/multiFieldsFlowValidation";
import { isFieldEmptyOrUndefined } from "~/util/isFieldEmptyOrUndefined";

const FIELDS_FOR_VALIDATION = [
  "annullierungErsatzverbindungFlugnummer",
  "annullierungErsatzverbindungAbflugsDatum",
  "annullierungErsatzverbindungAbflugsZeit",
  "annullierungErsatzverbindungAnkunftsDatum",
  "annullierungErsatzverbindungAnkunftsZeit",
];

const getFieldsForValidation = (data: Record<string, string>) => {
  return FIELDS_FOR_VALIDATION.map((path) => ({
    value: data[path],
    path: [path],
  }));
};

export function validateCancelFlightReplacementPage(
  baseSchema: MultiFieldsValidationBaseSchema,
) {
  return baseSchema.superRefine((data, ctx) => {
    const fields = getFieldsForValidation(data);

    const isAnyFieldFilled = fields.some(
      ({ value }) => !isFieldEmptyOrUndefined(value),
    );

    if (!isAnyFieldFilled) {
      return;
    }

    for (const { value, path } of fields) {
      if (isFieldEmptyOrUndefined(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "fillAllOrNone",
          path,
        });
      }
    }
  });
}
