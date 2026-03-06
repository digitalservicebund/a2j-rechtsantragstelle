import isTime from "validator/lib/isTime";
import { z } from "zod";
import { toDate } from "./dateString";

export const timeSchema = z
  .string()
  .trim()
  .min(1, { message: "required" })
  .refine((time) => /^\d\d:\d\d$/.test(time), { message: "format" })
  .refine((time) => isTime(time, { hourFormat: "hour24" }), {
    message: "invalid",
  });

const splitTime = (time: string) => time.split(":").map(Number);

export function dateAndTimeToTimestamp(date: string, time: string) {
  const [hours, minutes] = splitTime(time);
  return new Date(toDate(date).setHours(hours, minutes, 0, 0)).getTime();
}
