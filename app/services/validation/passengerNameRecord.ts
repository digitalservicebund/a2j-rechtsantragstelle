import { z } from "zod";

export const passengerNameRecordSchema = z
  .string()
  .toUpperCase()
  .transform((passengerNameRecord) => {
    // .trim() won't remove the inbetween space
    // e.g. " LH 234 " becomes "LH 234"
    return passengerNameRecord.split(" ").join("");
  })
  .refine(
    (passengerNameRecord) => {
      return /^[A-Z0-9]{6}$/.test(passengerNameRecord);
    },
    {
      message: "invalid_passenger_name_record_format",
    },
  );
