import { z } from "zod";
import type { ValidationMultipleFieldsBaseSchema } from "~/domains/validationsMultipleFields";

const THREE_HOURS_MILLISECONDS = 3 * 60 * 60 * 1000;

// Helper function to convert German date/time format to timestamp
function convertToTimestamp(date: string, time: string): number {
  const [day, month, year] = date.split(".").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes).getTime();
}

function isStartTimestampLessThanThreeHours(
  startTimestamp: number,
  endTimestamp: number,
) {
  const actualTimeDifferenceInMs = endTimestamp - startTimestamp;
  return actualTimeDifferenceInMs < THREE_HOURS_MILLISECONDS;
}

export function validateReplacementConnectionPage(
  baseSchema: ValidationMultipleFieldsBaseSchema,
) {
  return baseSchema.superRefine((data, ctx) => {
    const departureDateTime = convertToTimestamp(
      data.direktAbflugsDatum,
      data.direktAbflugsZeit,
    );

    const arrivalDateTime = convertToTimestamp(
      data.andereErsatzverbindungAnkunftsDatum,
      data.andereErsatzverbindungAnkunftsZeit,
    );

    if (departureDateTime > arrivalDateTime) {
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
      isStartTimestampLessThanThreeHours(departureDateTime, arrivalDateTime) &&
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

export function validateAnotherFlightPage(
  baseSchema: ValidationMultipleFieldsBaseSchema,
) {
  return baseSchema.superRefine((data, ctx) => {
    const departureDateTime = convertToTimestamp(
      data.direktAbflugsDatum,
      data.direktAbflugsZeit,
    );

    const arrivalDateTime = convertToTimestamp(
      data.ersatzFlugAnkunftsDatum,
      data.ersatzFlugAnkunftsZeit,
    );

    if (departureDateTime > arrivalDateTime) {
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
      isStartTimestampLessThanThreeHours(departureDateTime, arrivalDateTime) &&
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

export function validateSameFlightPage(
  baseSchema: ValidationMultipleFieldsBaseSchema,
) {
  return baseSchema.superRefine((data, ctx) => {
    const departureDateTime = convertToTimestamp(
      data.direktAbflugsDatum,
      data.direktAbflugsZeit,
    );

    const arrivalDateTime = convertToTimestamp(
      data.tatsaechlicherAnkunftsDatum,
      data.tatsaechlicherAnkunftsZeit,
    );

    if (departureDateTime > arrivalDateTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "departureAfterArrival",
        path: ["tatsaechlicherAnkunftsDatum"],
        fatal: true,
      });

      // add new issue to invalidate this field as well
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "departureAfterArrival",
        path: ["tatsaechlicherAnkunftsZeit"],
        fatal: true,
      });

      return z.NEVER;
    }

    if (
      isStartTimestampLessThanThreeHours(departureDateTime, arrivalDateTime)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "arrivalThreeHoursLessThanDeparture",
        path: ["tatsaechlicherAnkunftsDatum"],
        fatal: true,
      });

      // add new issue to invalidate this field as well
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "arrivalThreeHoursLessThanDeparture",
        path: ["tatsaechlicherAnkunftsZeit"],
        fatal: true,
      });

      return z.NEVER;
    }
  });
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
