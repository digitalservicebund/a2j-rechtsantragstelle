import type z from "zod";
import { type createSplitDateSchema } from "~/services/validation/date";

export type Date = z.infer<ReturnType<typeof createSplitDateSchema>>;

export const isDateObject = (value: unknown): value is Date => {
  return (
    typeof value === "object" &&
    value !== null &&
    "day" in value &&
    "month" in value &&
    "year" in value
  );
};
