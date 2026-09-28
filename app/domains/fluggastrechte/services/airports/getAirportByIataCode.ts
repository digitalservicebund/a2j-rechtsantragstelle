import airports from "data/airports/data.json";
import { serverOnly$ } from "vite-env-only/macros";
import type { Airport } from "./type";

const findAirport = serverOnly$((airportIataCode: string) =>
  airports.find((airport) => airport.iata === airportIataCode),
);

export function getAirportByIataCode(
  airportIataCode?: string,
): Airport | undefined {
  if (!airportIataCode || airportIataCode.length === 0) {
    return undefined;
  }
  const airport = findAirport ? findAirport(airportIataCode) : undefined;
  return airport;
}
