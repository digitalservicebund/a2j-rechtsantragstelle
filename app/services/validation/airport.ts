import { z } from "zod";
import airports from "data/airports/data.json";

export const airportSchema = z
  .string()
  .trim()
  .regex(/^[a-zA-Z]{3}$/, "wrong_airport_format")
  .transform((v) => v.toUpperCase())
  .refine(
    (airportCode) => airports.some((airport) => airport.iata === airportCode),
    {
      message: "invalid_airport_code",
    },
  );
