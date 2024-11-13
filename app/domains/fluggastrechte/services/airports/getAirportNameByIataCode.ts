import { getAirportByIataCode } from "./getAirportByIataCode";

export function getAirportNameByIataCode(airportIataCode: string): string {
  const airport = getAirportByIataCode(airportIataCode);

  if (airport) {
    return airport.airport.includes(airport.city)
      ? `${airport.airport} (${airport.iata})`
      : `${airport.city} ${airport.airport} (${airport.iata})`;
  }

  return "";
}
