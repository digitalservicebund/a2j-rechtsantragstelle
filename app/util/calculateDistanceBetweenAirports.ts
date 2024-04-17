import airports from "data/airports/data.json";
import haversine from "haversine-distance";
import { z } from "zod";

const KILOMETERS_IN_METERS = 1000;
const TWO_FRACTION_DIGITS = 2;

const AirportCoordinateSystemSchema = z.object({
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});

function getAirportByIataCode(airportIataCode: string): unknown {
  return airports.find((aiport) => aiport.iata === airportIataCode);
}

export function calculateDistanceBetweenAirportsInKilometers(
  startAirportIataCode: string,
  endAirportIataCode: string,
): number {
  const airportStart = AirportCoordinateSystemSchema.safeParse(
    getAirportByIataCode(startAirportIataCode),
  );
  const airportEnd = AirportCoordinateSystemSchema.safeParse(
    getAirportByIataCode(endAirportIataCode),
  );

  if (airportStart.success && airportEnd.success) {
    const haversineDistance = haversine(airportStart.data, airportEnd.data);
    const roundDistance = (haversineDistance / KILOMETERS_IN_METERS).toFixed(
      TWO_FRACTION_DIGITS,
    );
    return Number(roundDistance);
  }

  return -1;
}
