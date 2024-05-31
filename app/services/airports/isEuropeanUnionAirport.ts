import airports from "data/airports/data.json";
import { EUCountries } from "~/models/flows/fluggastrechte";

function getCountryCodeByIata(airportIata: string | undefined) {
  return airports.find((airport) => airport.iata === airportIata)?.country_code;
}

export function isEuropeanUnionAirport(airportCode: string): boolean {
  const airportCountry = getCountryCodeByIata(airportCode);

  if (typeof airportCountry === "undefined") {
    return true;
  }

  return EUCountries.includes(airportCountry);
}
