import { z } from "zod";
import { type MultiFieldsValidationBaseSchema } from "~/domains/types";
import { convertToTimestamp } from "~/util/date";
import { isStartTimestampLessThanThreeHours } from "./isStartTimestampLessThanThreeHours";
import type { fluggastrechteFlugdatenInputSchema } from "../../flugdaten/userData";

export function validateAnotherFlightPage(
  baseSchema: MultiFieldsValidationBaseSchema<
    Pick<
      typeof fluggastrechteFlugdatenInputSchema,
      | "ersatzFlugAnkunftsDatum"
      | "ersatzFlugAnkunftsZeit"
      | "direktAnkunftsDatum"
      | "direktAnkunftsZeit"
      | "bereich"
    >
  >,
) {
  return baseSchema.check((ctx) => {
    const originalArrivalDateTime = convertToTimestamp(
      ctx.value.direktAnkunftsDatum,
      ctx.value.direktAnkunftsZeit,
    );

    const arrivalDateTime = convertToTimestamp(
      ctx.value.ersatzFlugAnkunftsDatum,
      ctx.value.ersatzFlugAnkunftsZeit,
    );

    if (originalArrivalDateTime > arrivalDateTime) {
      ctx.issues.push({
        code: "custom",
        message: "departureAfterArrival",
        path: ["ersatzFlugAnkunftsDatum"],
        fatal: true,
        input: ctx.value.ersatzFlugAnkunftsDatum,
      });

      // add new issue to invalidate this field as well
      ctx.issues.push({
        code: "custom",
        message: "departureAfterArrival",
        path: ["ersatzFlugAnkunftsZeit"],
        fatal: true,
        input: ctx.value.ersatzFlugAnkunftsZeit,
      });

      return z.NEVER;
    }

    if (
      isStartTimestampLessThanThreeHours(
        originalArrivalDateTime,
        arrivalDateTime,
      ) &&
      ctx.value.bereich === "verspaetet"
    ) {
      ctx.issues.push({
        code: "custom",
        message: "arrivalThreeHoursLessThanDeparture",
        path: ["ersatzFlugAnkunftsDatum"],
        fatal: true,
        input: ctx.value.ersatzFlugAnkunftsDatum,
      });

      // add new issue to invalidate this field as well
      ctx.issues.push({
        code: "custom",
        message: "arrivalThreeHoursLessThanDeparture",
        path: ["ersatzFlugAnkunftsZeit"],
        fatal: true,
        input: ctx.value.ersatzFlugAnkunftsZeit,
      });

      return z.NEVER;
    }
  });
}
