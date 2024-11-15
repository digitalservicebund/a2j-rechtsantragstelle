import { z } from "zod";
import airlines from "data/airlines/data.json";
import { serverOnly } from "../serverOnly";

const serverValidation = serverOnly((airlineCode: string) =>
  airlines.some((airline) => airline.iata === airlineCode),
);

export const airlineSchema = z
  .string()
  .trim()
  .refine(
    (airlineCode) =>
      serverValidation === undefined || serverValidation(airlineCode),
    {
      message: "invalid_airline_code",
    },
  );
