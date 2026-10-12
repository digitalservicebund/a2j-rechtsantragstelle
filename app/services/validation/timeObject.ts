import z from "zod";
import { stringRequiredSchema } from "./stringRequired";
import isTime from "validator/lib/isTime";
import { translations } from "../translations/translations";
import { toDate } from "./dateString";

export const createSplitTimeSchema = () => {
  return z
    .object({
      hour: stringRequiredSchema,
      minute: stringRequiredSchema,
    })
    .meta({ description: "split_time" })
    .check((ctx) => {

      const hour = ctx.value.hour;
      const minute = ctx.value.minute;
      let hasFieldError = false

      if (Number.isNaN(Number(hour)) || hour.length !== 2) {
        ctx.issues.push({
          code: "custom",
          message: "Ungültiger Stunde",
          path: ["hour"],
          input: ctx.value,
        });
        hasFieldError = true;
      }

      if (Number.isNaN(Number(minute)) || minute.length !== 2) {
        ctx.issues.push({
          code: "custom",
          message: "Ungültiger Minute",
          path: ["minute"],
          input: ctx.value,
        });

        hasFieldError = true;
      }

      if (hasFieldError) {
        return;
      }

      if (isTime(toTimeString(ctx.value), { hourFormat: "hour24" })) return;

      // attach to the leaf fields (not the parent path) so RVF's
      // per-field validation picks the error back up after it clears

      ["hour", "minute"].forEach((path) => {
        ctx.issues.push({
          code: "custom",
          message: translations.splitTimeComponent.errorWrongTime.de,
          path: [path],
          input: ctx.value,
        });
      });
    });
};

export type TimeObject = { hour: string; minute: string };

export const toTimeString = (date?: TimeObject) => {
  return date === undefined ? "" : `${date.hour}:${date.minute}`;
};

export function dateAndTimeToTimestamp(date: string, time: TimeObject) {
  return new Date(
    toDate(date).setHours(Number(time.hour), Number(time.minute), 0, 0),
  ).getTime();
}
