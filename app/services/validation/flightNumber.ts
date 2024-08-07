import { z } from "zod";

export const flightNumberSchema = z
  .string()
  .toUpperCase()
  .transform((flightNumber) => {
    // .trim() won't remove the inbetween space
    // e.g. " LH 234 " becomes "LH 234"
    return flightNumber.split(" ").join("");
  })
  .refine(
    (flightNumber) => {
      return /^[A-Z]{2,3}\d{1,4}$/.test(flightNumber);
    },
    {
      message: "invalid_flight_number_format",
    },
  );
