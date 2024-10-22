import { getAirportByIataCode } from "./getAirportByIataCode";

export const isGermanAirport = (airportCode: string | undefined): boolean => {
  if (typeof airportCode === "undefined") {
    return false;
  }

  const airportCountry = getAirportByIataCode(airportCode)?.country_code;

  return airportCountry === "DE";
};
