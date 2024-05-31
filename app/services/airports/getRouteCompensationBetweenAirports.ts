import { calculateDistanceBetweenAirportsInKilometers } from "./calculateDistanceBetweenAirports";
import { isEuropeanUnionAirport } from "./isEuropeanUnionAirport";

export type RouteCompensation =
  | "shortDistance"
  | "middleDistance"
  | "longDistanceInsideEU"
  | "longDistanceOutsideEU"
  | "notPossibleCalculateDistance";

const LONG_DISTANCE_KILOMETERS = 3500;
const MIDDLE_DISTANCE_KILOMETERS = 1500;

export function getRouteCompensationBetweenAirports(
  startAirport: string,
  endAirport: string,
): RouteCompensation {
  const distanceKm = calculateDistanceBetweenAirportsInKilometers(
    startAirport,
    endAirport,
  );

  if (distanceKm.isOk) {
    if (distanceKm.value > LONG_DISTANCE_KILOMETERS) {
      const isStartAirportEU = isEuropeanUnionAirport(startAirport);
      const isEndAirportEU = isEuropeanUnionAirport(endAirport);

      if (isStartAirportEU.isOk && isEndAirportEU.isOk) {
        return isStartAirportEU.value && isEndAirportEU.value
          ? "longDistanceInsideEU"
          : "longDistanceOutsideEU";
      }
    }

    if (distanceKm.value > MIDDLE_DISTANCE_KILOMETERS) {
      return "middleDistance";
    }

    return "shortDistance";
  }

  return "notPossibleCalculateDistance";
}
