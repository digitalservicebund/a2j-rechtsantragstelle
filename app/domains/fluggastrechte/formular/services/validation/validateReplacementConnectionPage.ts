import { z } from "zod";
import { type MultiFieldsValidationBaseSchema } from "~/domains/types";
import { convertToTimestamp } from "~/util/date";
import { isStartTimestampLessThanThreeHours } from "./isStartTimestampLessThanThreeHours";
import type { fluggastrechteFlugdatenInputSchema } from "../../flugdaten/userData";

export function validateReplacementConnectionPage(
  baseSchema: MultiFieldsValidationBaseSchema<
    Pick<
      typeof fluggastrechteFlugdatenInputSchema,
      | "bereich"
      | "direktAnkunftsDatum"
      | "direktAnkunftsZeit"
      | "andereErsatzverbindungAnkunftsDatum"
      | "andereErsatzverbindungAnkunftsZeit"
    >
  >,
) {
  return baseSchema.superRefine((data, ctx) => {
    const originalArrivalDateTime = convertToTimestamp(
      data.direktAnkunftsDatum,
      data.direktAnkunftsZeit,
    );

    const arrivalDateTime = convertToTimestamp(
      data.andereErsatzverbindungAnkunftsDatum,
      data.andereErsatzverbindungAnkunftsZeit,
    );

    if (originalArrivalDateTime > arrivalDateTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "departureAfterArrival",
        path: ["andereErsatzverbindungAnkunftsDatum"],
        fatal: true,
      });

      // add new issue to invalidate this field as well
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "departureAfterArrival",
        path: ["andereErsatzverbindungAnkunftsZeit"],
        fatal: true,
      });

      return z.NEVER;
    }

    if (
      isStartTimestampLessThanThreeHours(
        originalArrivalDateTime,
        arrivalDateTime,
      ) &&
      data.bereich === "verspaetet"
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "arrivalThreeHoursLessThanDeparture",
        path: ["andereErsatzverbindungAnkunftsDatum"],
        fatal: true,
      });

      // add new issue to invalidate this field as well
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "arrivalThreeHoursLessThanDeparture",
        path: ["andereErsatzverbindungAnkunftsZeit"],
        fatal: true,
      });

      return z.NEVER;
    }
  });
}
