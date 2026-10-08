import z from "zod";
import { stringRequiredSchema } from "./stringRequired";
import { isTime } from "validator";

export const createSplitTimeSchema = () => {
  return z
    .object({
      hour: stringRequiredSchema
        .refine(
          (val) => {
            const num = Number(val);
            return !Number.isNaN(num) && val.length <= 2;
          },
          { error: "Ungültiger Stunden" },
        )
        .transform((val) => val.padStart(2, "0")),
      minute: stringRequiredSchema
        .refine(
          (val) => {
            const num = Number(val);
            return !Number.isNaN(num) && val.length <= 2;
          },
          { error: "Ungültiger Minuten" },
        )
        .transform((val) => val.padStart(2, "0")),
    })
    .meta({ description: "split_time" })
    .refine(
      (timeObj) => isTime(toTimeString(timeObj), { hourFormat: "hour24" }),
      {
        error: "Ungültige Uhrzeit",
      },
    );
};

export type TimeObject = { hour: string; minute: string };

export const toTimeString = (date: TimeObject) => `${date.hour}:${date.minute}`;
