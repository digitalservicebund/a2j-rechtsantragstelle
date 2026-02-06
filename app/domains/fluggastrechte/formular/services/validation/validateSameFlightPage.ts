import { z } from "zod";
import { type MultiFieldsValidationBaseSchema } from "~/domains/types";
import { convertToTimestamp } from "~/util/date";
import { isStartTimestampLessThanThreeHours } from "./isStartTimestampLessThanThreeHours";
import { fluggastrechteFlugdatenPages } from "../../flugdaten/pages";

const _schema =
  fluggastrechteFlugdatenPages.flugdatenTatsaechlicherFlugAnkunft.pageSchema;

  const formatDate = (
  date: string | { day: string; month: string; year: string },
) =>
  typeof date === "string"
    ? date
    : `${date.day}.${date.month}.${date.year}`;

export function validateSameFlightPage(
  baseSchema: MultiFieldsValidationBaseSchema<
    Pick<
      typeof _schema,
      | "tatsaechlicherAnkunftsDatum"
      | "tatsaechlicherAnkunftsZeit"
      | "direktAnkunftsDatum"
      | "direktAnkunftsZeit"
    >
  >,
) {
  return baseSchema.check((ctx) => {
    const originalArrivalDateTime = convertToTimestamp(
      formatDate(ctx.value.direktAnkunftsDatum),
      ctx.value.direktAnkunftsZeit,
    );
    const arrivalDateTime = convertToTimestamp(
      formatDate(ctx.value.tatsaechlicherAnkunftsDatum),
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
