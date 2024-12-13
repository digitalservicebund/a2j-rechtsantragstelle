import type { z } from "zod";

// Helper function to convert German date/time format to timestamp
function convertToTimestamp(date: string, time: string): number {
  const [day, month, year] = date.split(".").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes).getTime();
}
function convertToDate(date: string): number {
  const [day, month, year] = date.split(".").map(Number);
  return new Date(year, month - 1, day).getTime();
}

export function getArrivalTimeDelayValidator(
  baseSchema: z.ZodObject<Record<string, z.ZodTypeAny>>,
) {
  return baseSchema.refine(
    (data) => {
      const arrivalTimestamp = convertToTimestamp(
        data.tatsaechlicherAnkunftsDatum,
        data.tatsaechlicherAnkunftsZeit,
      );
      const departureTimestamp = convertToTimestamp(
        data.direktAbflugsDatum,
        data.direktAbflugsZeit,
      );

      const minimumTimeDifferenceInMs = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
      const actualTimeDifferenceInMs = arrivalTimestamp - departureTimestamp;
      return actualTimeDifferenceInMs >= minimumTimeDifferenceInMs;
    },
    {
      message: "invalidTimeDelay",
      path: ["tatsaechlicherAnkunftsZeit"],
    },
  );
}

export function getArrivalDateValidator(
  baseSchema: z.ZodObject<Record<string, z.ZodTypeAny>>,
) {
  return baseSchema.refine(
    (data) => {
      const arrivalDate = convertToDate(data.tatsaechlicherAnkunftsDatum);
      const departureDate = convertToDate(data.direktAbflugsDatum);

      const actualTimeDifferenceInMs = arrivalDate - departureDate;
      return actualTimeDifferenceInMs >= 0;
    },
    {
      message: "invalidDate",
      path: ["tatsaechlicherAnkunftsDatum"],
    },
  );
}
