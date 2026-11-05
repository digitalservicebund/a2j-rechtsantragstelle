import type z from "zod";
import { toDate } from "~/services/validation/dateObject";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

export type DateInput = {
  day?: string;
  month?: string;
  year?: string;
};

export const validateDateRange = (
  ctx: z.core.ParsePayload<unknown>,
  startDate: DateInput | null | undefined,
  endDate: DateInput | null | undefined,
  endKey: string,
) => {
  if (startDate == null || endDate == null) return;

  if (
    !objectKeysNonEmpty(startDate, ["day", "month", "year"]) ||
    !objectKeysNonEmpty(endDate, ["day", "month", "year"])
  ) {
    return;
  }

  const start = toDate(startDate);
  const end = toDate(endDate);

  if (start == null || end == null) return;

  if (start >= end) {
    ctx.issues.push({
      code: "custom",
      message: "Das Datum 'Bis wann' muss nach dem Datum 'Ab wann' liegen",
      path: [endKey] as never,
      fatal: true,
      input: endDate,
    });
  }
};
