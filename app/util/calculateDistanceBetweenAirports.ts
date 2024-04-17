import airports from "data/airports/data.json";
import haversine from "haversine-distance";
import { z } from "zod";

const KILOMENTERS_IN_METERS = 1000;
const TWO_FRACTION_DIGITS = 2;

const LatitudeLongitudeSchema = z.object({
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
  const airportStart = LatitudeLongitudeSchema.safeParse(
    getAirportByIataCode(startAirportIataCode),
  );
  const airportEnd = LatitudeLongitudeSchema.safeParse(
    getAirportByIataCode(endAirportIataCode),
  );

  if (airportStart.success && airportEnd.success) {
    const haversineDistance = haversine(airportStart.data, airportEnd.data);
    const roundDistance = (haversineDistance / KILOMENTERS_IN_METERS).toFixed(
      TWO_FRACTION_DIGITS,
    );
    return Number(roundDistance);
  }

  return -1;
}
