import { getAirportByIataCode } from "./getAirportByIataCode";

export const isGermanAirport = (airportCode: string | undefined): boolean => {
  if (!airportCode) return false;

  const airportCountry = getAirportByIataCode(airportCode)?.country_code;

  return airportCountry === "DE";
};
