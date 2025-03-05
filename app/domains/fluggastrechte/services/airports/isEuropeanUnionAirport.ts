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
  // Special cases
  "CH",
  "AX",
  "GF",
  "GP",
  "MQ",
  "RE",
  "YT",
  "MF",
  "BL",
  "EA",
  "LI",
  "IS",
  "NO",
];

export function isEuropeanUnionAirport(
  airportCode: string | undefined,
): boolean {
  if (typeof airportCode === "undefined") {
    return false;
  }

  const airportCountry = getAirportByIataCode(airportCode)?.country_code;

  if (typeof airportCountry === "undefined") {
    return false;
  }

  return EU_COUNTRIES.includes(airportCountry);
}
