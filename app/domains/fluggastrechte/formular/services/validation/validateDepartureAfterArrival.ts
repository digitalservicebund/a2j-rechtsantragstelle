import { z } from "zod";
import { type MultiFieldsValidationBaseSchema } from "~/domains/types";
import { convertToTimestamp } from "~/util/date";
import type { fluggastrechteFlugdatenInputSchema } from "../../flugdaten/userData";

export function validateDepartureAfterArrival(
  baseSchema: MultiFieldsValidationBaseSchema<
    Pick<
      typeof fluggastrechteFlugdatenInputSchema,
      | "direktAbflugsDatum"
      | "direktAbflugsZeit"
      | "direktAnkunftsDatum"
      | "direktAnkunftsZeit"
    >
  >,
) {
  return baseSchema.superRefine((data, ctx) => {
    const departureDateTime = convertToTimestamp(
      data.direktAbflugsDatum,
      data.direktAbflugsZeit,
    );

    const arrivalDateTime = convertToTimestamp(
      data.direktAnkunftsDatum,
      data.direktAnkunftsZeit,
    );

    if (departureDateTime >= arrivalDateTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "departureAfterArrival",
        path: ["direktAnkunftsZeit"],
        fatal: true,
      });

      // add new issue to invalidate this field as well
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "departureAfterArrival",
        path: ["direktAnkunftsDatum"],
        fatal: true,
      });

      return z.NEVER;
    }
  });
}
