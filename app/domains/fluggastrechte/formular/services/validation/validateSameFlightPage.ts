import { z } from "zod";
import { type MultiFieldsValidationBaseSchema } from "~/domains/types";
import { convertToTimestamp } from "~/util/date";
import { isStartTimestampLessThanThreeHours } from "./isStartTimestampLessThanThreeHours";
import { getAllPageSchemaByFlowId } from "~/domains/pageSchemas";

const _schema = getAllPageSchemaByFlowId("/fluggastrechte/formular");

export function validateSameFlightPage(
  baseSchema: MultiFieldsValidationBaseSchema<typeof _schema>,
) {
  return baseSchema.check((ctx) => {
    const originalArrivalDateTime = convertToTimestamp(
      ctx.value.direktAnkunftsDatum as string,
      ctx.value.direktAnkunftsZeit as string,
    );

    const arrivalDateTime = convertToTimestamp(
      ctx.value.tatsaechlicherAnkunftsDatum as string,
      ctx.value.tatsaechlicherAnkunftsZeit as string,
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
