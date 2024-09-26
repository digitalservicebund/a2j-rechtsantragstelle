import { z } from "zod";

export const bookingNumberFlightSchema = z
  .string()
  .toUpperCase()
  .transform((bookingNumberFlight) => {
    // .trim() won't remove the inbetween space
    // e.g. " LH 234 " becomes "LH 234"
    return bookingNumberFlight.split(" ").join("");
  })
  .refine(
    (bookingNumberFlight) => {
      return /^[A-Z0-9]{6}$/.test(bookingNumberFlight);
    },
    {
      message: "invalid_booking_number_flight_format",
    },
  );
