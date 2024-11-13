import airports from "data/airports/data.json";
import type { Airport } from "./type";

export function getAirportByIataCode(
  airportIataCode: string,
): Airport | undefined {
  if (airportIataCode.length === 0) {
    return undefined;
  }

  const airport = airports.find((airport) => airport.iata === airportIataCode);

  return airport;
}
