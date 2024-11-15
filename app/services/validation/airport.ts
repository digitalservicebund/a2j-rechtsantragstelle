import { z } from "zod";
import { getAirportByIataCode } from "~/domains/fluggastrechte/services/airports/getAirportByIataCode";
import { serverOnly } from "../serverOnly";

const serverValidation = serverOnly((airportCode: string) =>
  getAirportByIataCode(airportCode),
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
