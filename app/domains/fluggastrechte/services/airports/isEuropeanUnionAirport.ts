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
  "SX",
];

export function isEuropeanUnionAirport(
  airportCode: string | undefined,
): boolean {
  if (!airportCode) return false;
  const airportCountry = getAirportByIataCode(airportCode)?.country_code;
  if (!airportCountry) return false;
  return EU_COUNTRIES.includes(airportCountry);
}
