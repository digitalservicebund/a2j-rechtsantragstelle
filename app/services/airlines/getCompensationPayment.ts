import type { FluggastrechtVorabcheckContext } from "~/flows/fluggastrechteVorabcheck/context";
import {
  COMPENSATION_VALUE_250,
  COMPENSATION_VALUE_400,
  COMPENSATION_VALUE_600,
} from "~/flows/fluggastrechteVorabcheck/stringReplacements";
import { getRouteCompensationBetweenAirports } from "../airports/getRouteCompensationBetweenAirports";

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
