import { serverOnly$ } from "vite-env-only/macros";
import { z } from "zod";
import airlines from "data/airlines/data.json";

const serverValidation = serverOnly$((airlineCode: string) =>
  airlines.some((airline) => airline.iata === airlineCode),
);

export const airlineSchema = z
  .string()
  .trim()
  .nonempty({ message: "invalid_airline_code" })
  .refine(
    (airlineCode) =>
      serverValidation === undefined || serverValidation(airlineCode),
    {
      message: "invalid_airline_code",
    },
  );
