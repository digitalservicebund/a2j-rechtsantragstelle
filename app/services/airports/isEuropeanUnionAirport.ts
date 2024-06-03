import { Result } from "true-myth";
import airports from "data/airports/data.json";
import { EUCountries } from "~/models/flows/fluggastrechte";

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

  return Result.ok(EUCountries.includes(airportCountry));
}
