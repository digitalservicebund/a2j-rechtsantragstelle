import { z } from "zod";
import { type MultiFieldsValidationBaseSchema } from "~/domains/types";
import { convertToTimestamp } from "~/util/date";
import { isStartTimestampLessThanThreeHours } from "./isStartTimestampLessThanThreeHours";
import type { fluggastrechteFlugdatenInputSchema } from "../../flugdaten/userData";

export function validateSameFlightPage(
  baseSchema: MultiFieldsValidationBaseSchema<
    Pick<
      typeof fluggastrechteFlugdatenInputSchema,
      | "tatsaechlicherAnkunftsDatum"
      | "tatsaechlicherAnkunftsZeit"
      | "direktAnkunftsDatum"
      | "direktAnkunftsZeit"
    >
  >,
) {
  return baseSchema.check((ctx) => {
    const originalArrivalDateTime = convertToTimestamp(
      ctx.value.direktAnkunftsDatum,
      ctx.value.direktAnkunftsZeit,
    );

    const arrivalDateTime = convertToTimestamp(
      ctx.value.tatsaechlicherAnkunftsDatum,
      ctx.value.tatsaechlicherAnkunftsZeit,
    );

    if (originalArrivalDateTime > arrivalDateTime) {
      ctx.issues.push({
        code: "custom",
        message: "departureAfterArrival",
        path: ["tatsaechlicherAnkunftsDatum"],
        fatal: true,
        input: ctx.value.tatsaechlicherAnkunftsDatum,
      });

      // add new issue to invalidate this field as well
      ctx.issues.push({
        code: "custom",
        message: "departureAfterArrival",
        path: ["tatsaechlicherAnkunftsZeit"],
        fatal: true,
        input: ctx.value.tatsaechlicherAnkunftsZeit,
      });

      return z.NEVER;
    }

    if (
      isStartTimestampLessThanThreeHours(
        originalArrivalDateTime,
        arrivalDateTime,
      )
    ) {
      ctx.issues.push({
        code: "custom",
        message: "arrivalThreeHoursLessThanDeparture",
        path: ["tatsaechlicherAnkunftsDatum"],
        fatal: true,
        input: ctx.value.tatsaechlicherAnkunftsDatum,
      });

      // add new issue to invalidate this field as well
      ctx.issues.push({
        code: "custom",
        message: "arrivalThreeHoursLessThanDeparture",
        path: ["tatsaechlicherAnkunftsZeit"],
        fatal: true,
        input: ctx.value.tatsaechlicherAnkunftsZeit,
      });

      return z.NEVER;
    }
  });
}
