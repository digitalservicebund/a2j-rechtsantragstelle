import { z } from "zod";
import type { MultiFieldsValidationBaseSchema } from "~/domains/multiFieldsFlowValidation";

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

const isFieldEmptyOrUndefined = (field: string | undefined) => {
  return field === "" || typeof field == "undefined";
};

export function validateReplacementConnectionPage(
  baseSchema: MultiFieldsValidationBaseSchema,
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

export function validateSameFlightPage(
  baseSchema: MultiFieldsValidationBaseSchema,
) {
  return baseSchema.superRefine((data, ctx) => {
    const originalArrivalDateTime = convertToTimestamp(
      data.direktAnkunftsDatum,
      data.direktAnkunftsZeit,
    );

    const arrivalDateTime = convertToTimestamp(
      data.tatsaechlicherAnkunftsDatum,
      data.tatsaechlicherAnkunftsZeit,
    );

    if (originalArrivalDateTime > arrivalDateTime) {
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
      isStartTimestampLessThanThreeHours(
        originalArrivalDateTime,
        arrivalDateTime,
      )
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
  baseSchema: MultiFieldsValidationBaseSchema,
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

export function validateCancelFlightReplacementPage(
  baseSchema: MultiFieldsValidationBaseSchema,
) {
  return baseSchema.superRefine(
    (
      {
        annullierungErsatzverbindungAbflugsDatum,
        annullierungErsatzverbindungAbflugsZeit,
        annullierungErsatzverbindungAnkunftsDatum,
        annullierungErsatzverbindungAnkunftsZeit,
      },
      ctx,
    ) => {
      const addIssueToContext = (path: string[]) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "optionalFieldRequired", // these fields are optional, but if one is filled, the other must be filled as well
          path,
          fatal: true,
        });
      };

      if (
        isFieldEmptyOrUndefined(annullierungErsatzverbindungAbflugsDatum) &&
        !isFieldEmptyOrUndefined(annullierungErsatzverbindungAbflugsZeit)
      ) {
        addIssueToContext(["annullierungErsatzverbindungAbflugsDatum"]);
        return z.NEVER;
      }

      if (
        isFieldEmptyOrUndefined(annullierungErsatzverbindungAbflugsZeit) &&
        !isFieldEmptyOrUndefined(annullierungErsatzverbindungAbflugsDatum)
      ) {
        addIssueToContext(["annullierungErsatzverbindungAbflugsZeit"]);
        return z.NEVER;
      }

      if (
        isFieldEmptyOrUndefined(annullierungErsatzverbindungAnkunftsDatum) &&
        !isFieldEmptyOrUndefined(annullierungErsatzverbindungAnkunftsZeit)
      ) {
        addIssueToContext(["annullierungErsatzverbindungAnkunftsDatum"]);
        return z.NEVER;
      }

      if (
        isFieldEmptyOrUndefined(annullierungErsatzverbindungAnkunftsZeit) &&
        !isFieldEmptyOrUndefined(annullierungErsatzverbindungAnkunftsDatum)
      ) {
        addIssueToContext(["annullierungErsatzverbindungAnkunftsZeit"]);
        return z.NEVER;
      }
    },
  );
}
