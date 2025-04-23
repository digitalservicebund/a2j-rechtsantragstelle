import { z } from "zod";
import { type MultiFieldsValidationBaseSchema } from "~/domains/types";
import { convertToTimestamp } from "~/util/date";
import { isStartTimestampLessThanThreeHours } from "./isStartTimestampLessThanThreeHours";

export function validateAnotherFlightPage(
  baseSchema: MultiFieldsValidationBaseSchema,
) {
  return baseSchema.superRefine((data, ctx) => {
    const originalArrivalDateTime = convertToTimestamp(
      data.direktAnkunftsDatum,
      data.direktAnkunftsZeit,
    );

    const arrivalDateTime = convertToTimestamp(
      data.ersatzFlugAnkunftsDatum,
      data.ersatzFlugAnkunftsZeit,
    );

    if (originalArrivalDateTime > arrivalDateTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "departureAfterArrival",
        path: ["ersatzFlugAnkunftsDatum"],
        fatal: true,
      });

      // add new issue to invalidate this field as well
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "departureAfterArrival",
        path: ["ersatzFlugAnkunftsZeit"],
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
        path: ["ersatzFlugAnkunftsDatum"],
        fatal: true,
      });

      // add new issue to invalidate this field as well
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "arrivalThreeHoursLessThanDeparture",
        path: ["ersatzFlugAnkunftsZeit"],
        fatal: true,
      });

      return z.NEVER;
    }
  });
}
