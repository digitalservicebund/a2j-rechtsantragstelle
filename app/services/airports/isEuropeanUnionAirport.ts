import { Result } from "true-myth";
import { getAirportByIataCode } from "./getAirportByIataCode";

const EU_COUNTRIES = [
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "CH",
  "GF",
  "GP",
  "MQ",
  "RE",
  "AX",
];

export function isEuropeanUnionAirport(
  airportCode: string | undefined,
): Result<boolean, string> {
  if (typeof airportCode === "undefined") {
    return Result.err("Airport not found");
  }

  const airportCountry = getAirportByIataCode(airportCode)?.country_code;

  if (typeof airportCountry === "undefined") {
    return Result.err("Airport not found");
  }

  return Result.ok(EU_COUNTRIES.includes(airportCountry));
}
