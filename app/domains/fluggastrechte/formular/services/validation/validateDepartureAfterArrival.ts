import { z } from "zod";
import { type MultiFieldsValidationBaseSchema } from "~/domains/types";
import { convertToTimestamp } from "~/util/date";
import { getAllPageSchemaByFlowId } from "~/domains/pageSchemas";

const _schema = getAllPageSchemaByFlowId("/fluggastrechte/formular");

export function validateDepartureAfterArrival(
  baseSchema: MultiFieldsValidationBaseSchema<typeof _schema>,
) {
  return baseSchema.check((ctx) => {
    const departureDateTime = convertToTimestamp(
      ctx.value.direktAbflugsDatum as string,
      ctx.value.direktAbflugsZeit as string,
    );

    const arrivalDateTime = convertToTimestamp(
      ctx.value.direktAnkunftsDatum as string,
      ctx.value.direktAnkunftsZeit as string,
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
