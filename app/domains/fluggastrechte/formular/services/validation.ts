import { z } from "zod";
import type { MultiFieldsValidationBaseSchema } from "~/domains/multiFieldsFlowValidation";
import { isFieldEmptyOrUndefined } from "~/util/isFieldEmptyOrUndefined";

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

export function validateStopoverDuplicates(
  baseSchema: MultiFieldsValidationBaseSchema,
) {
  return baseSchema.superRefine((userData, ctx) => {
    const fieldsForValidation = [
      "ersterZwischenstopp",
      "zweiterZwischenstopp",
      "dritterZwischenstopp",
    ];

    const filledFields = fieldsForValidation
      .filter((fieldName) => userData[fieldName])
      .map((fieldName) => ({
        fieldName,
        value: userData[fieldName],
      }));

    for (const current of filledFields) {
      const duplicates = filledFields.filter(
        (other) =>
          other.fieldName !== current.fieldName &&
          other.value === current.value,
      );

      if (
        userData.startAirport === current.value ||
        userData.endAirport === current.value
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "initialFlightDuplicates",
          path: [current.fieldName],
        });
      }

      for (const duplicate of duplicates) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "stopoverDuplicates",
          path: [duplicate.fieldName],
        });
      }
    }
  });
}
