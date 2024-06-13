import { z } from "zod";
import airlines from "data/airlines/data.json";

export const airlineSchema = z
  .string()
  .trim()
  .transform((v) => v.toUpperCase())
  .refine(
    (airlineCode) => airlines.some((airline) => airline.iata === airlineCode),
    {
      message: "invalid_airport_code",
    },
  );
