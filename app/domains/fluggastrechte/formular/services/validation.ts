import { z } from "zod";
import type { ValidationMultipleFieldsBaseSchema } from "~/domains/validationsMultipleFields";

// Helper function to convert German date/time format to timestamp
function convertToTimestamp(date: string, time: string): number {
  const [day, month, year] = date.split(".").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes).getTime();
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
