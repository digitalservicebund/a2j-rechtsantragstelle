import haversine from "haversine-distance";
import { Result } from "true-myth";
import { z } from "zod";
import { getAirportByIataCode } from "./getAirportByIataCode";

const KILOMETERS_IN_METERS = 1000;
const TWO_FRACTION_DIGITS = 2;

const AirportCoordinateSystemSchema = z.object({
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});

export function calculateDistanceBetweenAirportsInKilometers(
  startAirportIataCode: string,
  endAirportIataCode: string,
): Result<number, string> {
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
    return Result.ok(Number(roundDistance));
  }

  return Result.err(
    `It was not possible to calculate the distance between the airports ${startAirportIataCode} and ${endAirportIataCode}`,
  );
}
