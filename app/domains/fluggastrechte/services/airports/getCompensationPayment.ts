import {
  COMPENSATION_VALUE_250,
  COMPENSATION_VALUE_400,
  COMPENSATION_VALUE_600,
} from "~/domains/fluggastrechte/vorabcheck/stringReplacements";
import type { FluggastrechtVorabcheckUserData } from "~/domains/fluggastrechte/vorabcheck/userData";
import { getRouteCompensationBetweenAirports } from "./getRouteCompensationBetweenAirports";

export function getCompensationPayment({
  startAirport = "",
  endAirport = "",
}: FluggastrechtVorabcheckUserData) {
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
