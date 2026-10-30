import z from "zod";
import { stringRequiredSchema } from "./stringRequired";
import { stringOptionalSchema } from "./stringOptional";
import isTime from "validator/lib/isTime";
import { translations } from "../translations/translations";
import { toDate, type DateObject } from "./dateObject";
import { type AllowedUserTypes } from "~/domains/userData";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

// treats a missing field the same as an empty one, since zod can call .refine with either
const isBlank = (val?: string): val is undefined | "" =>
  !val || val.length === 0;

// a time part is only valid as a 2-digit numeric string
const isInvalidTimePart = (val?: string) =>
  isBlank(val) || Number.isNaN(Number(val)) || val.length !== 2;

type TimeField = "hour" | "minute";

export const createSplitTimeSchema = () => {
  return z
    .object({
      hour: stringRequiredSchema,
      minute: stringRequiredSchema,
    })
    .meta({ description: "split_time" })
    .check((ctx) => {
      const pushIssue = (path: TimeField, message: string) =>
        ctx.issues.push({
          code: "custom",
          message,
          path: [path],
          input: ctx.value,
        });

      const { hour, minute } = ctx.value;
      let hasFieldError = false;

      if (isInvalidTimePart(hour)) {
        pushIssue("hour", translations.splitTimeComponent.invalidHour.de);
        hasFieldError = true;
      }

      if (isInvalidTimePart(minute)) {
        pushIssue("minute", translations.splitTimeComponent.invalidMinute.de);
        hasFieldError = true;
      }

      if (hasFieldError) {
        return;
      }

      if (isTime(toTimeString({ hour, minute }), { hourFormat: "hour24" }))
        return;

      // attach to the leaf fields (not the parent path) so RVF's
      // per-field validation picks the error back up after it clears
      (["hour", "minute"] as const).forEach((path) =>
        pushIssue(path, translations.splitTimeComponent.invalidTime.de),
      );
    });
};

export const createSplitTimeSchemaOptional = () => {
  return z
    .object({
      hour: stringOptionalSchema,
      minute: stringOptionalSchema,
    })
    .meta({ description: "split_time" })
    .check((ctx) => {
      const pushIssue = (path: TimeField, message: string) =>
        ctx.issues.push({
          code: "custom",
          message,
          path: [path],
          input: ctx.value,
        });

      const { hour, minute } = ctx.value;

      if (isBlank(hour) && isBlank(minute)) {
        return;
      }

      let hasFieldError = false;

      if (isInvalidTimePart(hour)) {
        pushIssue("hour", translations.splitTimeComponent.invalidHour.de);
        hasFieldError = true;
      }

      if (isInvalidTimePart(minute)) {
        pushIssue("minute", translations.splitTimeComponent.invalidMinute.de);
        hasFieldError = true;
      }

      if (hasFieldError) {
        return;
      }

      // past the checks above, hour and minute are guaranteed valid strings
      const time = { hour, minute } as TimeObject;
      if (isTime(toTimeString(time), { hourFormat: "hour24" })) return;

      (["hour", "minute"] as const).forEach((path) =>
        pushIssue(path, translations.splitTimeComponent.invalidTime.de),
      );
    });
};

export type TimeObject = { hour: string; minute: string };

export const toTimeString = (time?: TimeObject) =>
  hasTimeObject(time) ? `${time.hour}:${time.minute}` : "";

export const hasTimeObject = (time: Partial<TimeObject> | undefined) => {
  return objectKeysNonEmpty(time, ["hour", "minute"]);
};

export function dateAndTimeToTimestamp(date: DateObject, time: TimeObject) {
  return new Date(
    toDate(date).setHours(Number(time.hour), Number(time.minute), 0, 0),
  ).getTime();
}

export const isItemValueTimeObject = (
  itemValue: AllowedUserTypes,
): itemValue is TimeObject => {
  return (
    typeof itemValue === "object" &&
    "hour" in itemValue &&
    "minute" in itemValue
  );
};
