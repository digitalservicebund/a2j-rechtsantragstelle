import type { FluggastrechtVorabcheckContext } from "~/flows/fluggastrechte/vorabcheck/context";
import {
  COMPENSATION_VALUE_250,
  COMPENSATION_VALUE_400,
  COMPENSATION_VALUE_600,
} from "~/flows/fluggastrechte/vorabcheck/stringReplacements";
import { getRouteCompensationBetweenAirports } from "./getRouteCompensationBetweenAirports";

export function getCompensationPayment({
  startAirport = "",
  endAirport = "",
}: FluggastrechtVorabcheckContext) {
  const routeCompensation = getRouteCompensationBetweenAirports(
    startAirport,
    endAirport,
  );

  switch (routeCompensation) {
    case "longDistanceOutsideEU": {
      return COMPENSATION_VALUE_600;
    }
    case "longDistanceInsideEU":
    case "middleDistance": {
      return COMPENSATION_VALUE_400;
    }
    case "shortDistance": {
      return COMPENSATION_VALUE_250;
    }
    default: {
      return "";
    }
  }
}
