import {
  COMPENSATION_VALUE_250,
  COMPENSATION_VALUE_400,
  COMPENSATION_VALUE_600,
} from "~/domains/fluggastrechte/vorabcheck/stringReplacements";
import { getRouteCompensationBetweenAirports } from "./getRouteCompensationBetweenAirports";
import { type FluggastrechteFormularWeiterePersonen } from "~/domains/fluggastrechte/formular/persoenlicheDaten/pages";

export type CompensationClaimContext = {
  startAirport?: string;
  endAirport?: string;
  weiterePersonen?: FluggastrechteFormularWeiterePersonen;
};

export function getCompensationPayment({
  startAirport = "",
  endAirport = "",
}: CompensationClaimContext) {
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
    case "notPossibleCalculateDistance":
    default: {
      return "";
    }
  }
}
