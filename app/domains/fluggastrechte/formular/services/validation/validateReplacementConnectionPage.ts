import { z } from "zod";
import { type MultiFieldsValidationBaseSchema } from "~/domains/types";
import { convertToTimestamp } from "~/util/date";
import { isStartTimestampLessThanThreeHours } from "./isStartTimestampLessThanThreeHours";
import { getAllPageSchemaByFlowId } from "~/domains/pageSchemas";

const _schema = getAllPageSchemaByFlowId("/fluggastrechte/formular");

export function validateReplacementConnectionPage(
  baseSchema: MultiFieldsValidationBaseSchema<typeof _schema>,
) {
  return baseSchema.check((ctx) => {
    const originalArrivalDateTime = convertToTimestamp(
      ctx.value.direktAnkunftsDatum as string,
      ctx.value.direktAnkunftsZeit as string,
    );

    const arrivalDateTime = convertToTimestamp(
      ctx.value.andereErsatzverbindungAnkunftsDatum as string,
      ctx.value.andereErsatzverbindungAnkunftsZeit as string,
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
