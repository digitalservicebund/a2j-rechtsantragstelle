import { serverOnly$ } from "vite-env-only/macros";
import { z } from "zod";
import airports from "data/airports/data.json";

const serverValidation = serverOnly$((airportCode: string) =>
  airports.some((airport) => airport.iata === airportCode),
);

export const airportSchema = z
  .string()
  .trim()
  .regex(/^[a-zA-Z]{3}$/, "wrong_airport_format")
  .transform((v) => v.toUpperCase())
  .refine(
    (airportCode) =>
      serverValidation === undefined || serverValidation(airportCode),
    {
      message: "invalid_airport_code",
    },
  );
