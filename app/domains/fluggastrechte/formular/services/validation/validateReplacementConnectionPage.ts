import { z } from "zod";
import { type MultiFieldsValidationBaseSchema } from "~/domains/types";
import { convertToTimestamp } from "~/util/date";
import { isStartTimestampLessThanThreeHours } from "./isStartTimestampLessThanThreeHours";
import { fluggastrechteFlugdatenPages } from "../../flugdaten/pages";

const _schema =
  fluggastrechteFlugdatenPages.flugdatenErsatzverbindungBeschreibung.pageSchema;

export function validateReplacementConnectionPage(
  baseSchema: MultiFieldsValidationBaseSchema<
    Pick<
      typeof _schema,
      | "bereich"
      | "direktAnkunftsDatum"
      | "direktAnkunftsZeit"
      | "andereErsatzverbindungAnkunftsDatum"
      | "andereErsatzverbindungAnkunftsZeit"
    >
  >,
) {
  return baseSchema.check((ctx) => {
    const originalArrivalDateTime = convertToTimestamp(
      ctx.value.direktAnkunftsDatum.day +
        "." +
        ctx.value.direktAnkunftsDatum.month +
        "." +
        ctx.value.direktAnkunftsDatum.year,
      ctx.value.direktAnkunftsZeit,
    );

    const arrivalDateTime = convertToTimestamp(
      ctx.value.andereErsatzverbindungAnkunftsDatum.day +
        "." +
        ctx.value.andereErsatzverbindungAnkunftsDatum.month +
        "." +
        ctx.value.andereErsatzverbindungAnkunftsDatum.year,
      ctx.value.andereErsatzverbindungAnkunftsZeit,
    );

    if (originalArrivalDateTime > arrivalDateTime) {
      ctx.issues.push({
        code: "custom",
        message: "departureAfterArrival",
        path: ["andereErsatzverbindungAnkunftsDatum"],
        fatal: true,
        input: ctx.value.andereErsatzverbindungAnkunftsDatum,
      });

      // add new issue to invalidate this field as well
      ctx.issues.push({
        code: "custom",
        message: "departureAfterArrival",
        path: ["andereErsatzverbindungAnkunftsZeit"],
        fatal: true,
        input: ctx.value.andereErsatzverbindungAnkunftsZeit,
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
        path: ["andereErsatzverbindungAnkunftsDatum"],
        fatal: true,
        input: ctx.value.andereErsatzverbindungAnkunftsDatum,
      });

      // add new issue to invalidate this field as well
      ctx.issues.push({
        code: "custom",
        message: "arrivalThreeHoursLessThanDeparture",
        path: ["andereErsatzverbindungAnkunftsZeit"],
        fatal: true,
        input: ctx.value.andereErsatzverbindungAnkunftsZeit,
      });

      return z.NEVER;
    }
  });
}
