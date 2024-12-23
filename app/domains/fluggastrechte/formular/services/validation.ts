import { z } from "zod";
import type { ValidationMultipleFieldsBaseSchema } from "~/domains/validationsMultipleFields";

// Helper function to convert German date/time format to timestamp
function convertToTimestamp(date: string, time: string): number {
  const [day, month, year] = date.split(".").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes).getTime();
}
function convertToDate(date: string): number {
  const [day, month, year] = date.split(".").map(Number);
  return new Date(year, month - 1, day).getTime();
}

export function getArrivalTimeDelayValidator(
  baseSchema: ValidationMultipleFieldsBaseSchema,
) {
  return baseSchema.refine(
    (data) => {
      const arrivalTimestamp = convertToTimestamp(
        data.tatsaechlicherAnkunftsDatum,
        data.tatsaechlicherAnkunftsZeit,
      );
      const departureTimestamp = convertToTimestamp(
        data.direktAbflugsDatum,
        data.direktAbflugsZeit,
      );

      const minimumTimeDifferenceInMs = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
      const actualTimeDifferenceInMs = arrivalTimestamp - departureTimestamp;
      return actualTimeDifferenceInMs >= minimumTimeDifferenceInMs;
    },
    {
      message: "invalidTimeDelay",
      path: ["tatsaechlicherAnkunftsZeit"],
    },
  );
}

export function getArrivalDateValidator(
  baseSchema: ValidationMultipleFieldsBaseSchema,
) {
  return baseSchema.refine(
    (data) => {
      const arrivalDate = convertToDate(data.tatsaechlicherAnkunftsDatum);
      const departureDate = convertToDate(data.direktAbflugsDatum);

      const actualTimeDifferenceInMs = arrivalDate - departureDate;
      return actualTimeDifferenceInMs >= 0;
    },
    {
      message: "invalidDate",
      path: ["tatsaechlicherAnkunftsDatum"],
    },
  );
}

export function validateDepartureAfterArrival(
  baseSchema: ValidationMultipleFieldsBaseSchema,
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

    if (departureDateTime > arrivalDateTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "too_late",
        path: ["direktAnkunftsDatum"],
        fatal: true,
      });

      return z.NEVER;
    }
  });
}
