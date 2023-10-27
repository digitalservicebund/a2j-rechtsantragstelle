import { z } from "zod";

export const airportSchema = z
  .string()
  .trim()
  .regex(/^[a-zA-Z]{3}$/, "wrong_airport_format")
  .transform((v) => v.toUpperCase());
