import { z } from "zod";
import { type MultiFieldsValidationBaseSchema } from "~/domains/types";
import { convertToTimestamp } from "~/util/date";
import { fluggastrechteFlugdatenPages } from "../../flugdaten/pages";

const _schema = fluggastrechteFlugdatenPages.flugdatenGeplanterFlug.pageSchema;

export function validateDepartureAfterArrival(
  baseSchema: MultiFieldsValidationBaseSchema<
    Pick<
      typeof _schema,
      | "direktAbflugsDatum"
      | "direktAbflugsZeit"
      | "direktAnkunftsDatum"
      | "direktAnkunftsZeit"
    >
  >,
) {
  return baseSchema.check((ctx) => {
    const departureDateTime = convertToTimestamp(
      ctx.value.direktAbflugsDatum,
      ctx.value.direktAbflugsZeit,
    );

    const arrivalDateTime = convertToTimestamp(
      ctx.value.direktAnkunftsDatum,
      ctx.value.direktAnkunftsZeit,
    );

    if (departureDateTime >= arrivalDateTime) {
      ctx.issues.push({
        code: "custom",
        message: "departureAfterArrival",
        path: ["direktAnkunftsZeit"],
        fatal: true,
        input: ctx.value.direktAnkunftsZeit,
      });

      // add new issue to invalidate this field as well
      ctx.issues.push({
        code: "custom",
        message: "departureAfterArrival",
        path: ["direktAnkunftsDatum"],
        fatal: true,
        input: ctx.value.direktAnkunftsDatum,
      });

      return z.NEVER;
    }
  });
}
