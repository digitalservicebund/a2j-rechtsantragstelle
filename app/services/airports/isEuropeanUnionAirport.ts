import { Result } from "true-myth";
import airports from "data/airports/data.json";

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

function getCountryCodeByIata(airportIata: string | undefined) {
  return airports.find((airport) => airport.iata === airportIata)?.country_code;
}

export function isEuropeanUnionAirport(
  airportCode: string | undefined,
): Result<boolean, string> {
  const airportCountry = getCountryCodeByIata(airportCode);

  if (typeof airportCountry === "undefined") {
    return Result.err("Airport not found");
  }

  return Result.ok(EU_COUNTRIES.includes(airportCountry));
}
