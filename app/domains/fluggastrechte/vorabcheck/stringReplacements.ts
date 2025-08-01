import airlines from "data/airlines/data.json";
import { getAirportNameByIataCode } from "~/domains/fluggastrechte/services/airports/getAirportNameByIataCode";
import { getRouteCompensationBetweenAirports } from "~/domains/fluggastrechte/services/airports/getRouteCompensationBetweenAirports";
import { toGermanDateFormat, today } from "~/util/date";
import { isErfolgAnalog } from "./services/isErfolgAnalog";
import type { FluggastrechtVorabcheckUserData } from "./userData";

export const COMPENSATION_VALUE_250 = "250";
export const COMPENSATION_VALUE_400 = "400";
export const COMPENSATION_VALUE_600 = "600";
const FOUR_YEARS_AGO = 4;
const LAST_DAY_YEAR = 31;
const LAST_MONTH_YEAR = 11; // Date.setMonth starts from 0 to 11, where 11 is December
const ARBITRATION_BOARD_BFJ = "BfJ";
const ARBITRATION_BOARD_RV = "RV";

export function getCompensationPaymentString({
  startAirport = "",
  endAirport = "",
}: FluggastrechtVorabcheckUserData) {
  const routeCompensation = getRouteCompensationBetweenAirports(
    startAirport,
    endAirport,
  );
  switch (routeCompensation) {
    case "longDistanceOutsideEU": {
      return {
        compensationPayment: COMPENSATION_VALUE_600,
      };
    }
    case "longDistanceInsideEU":
    case "middleDistance": {
      return {
        compensationPayment: COMPENSATION_VALUE_400,
      };
    }

    case "shortDistance": {
      return {
        compensationPayment: COMPENSATION_VALUE_250,
      };
    }
    case "notPossibleCalculateDistance":
    default: {
      return {};
    }
  }
}

export function getLastDayFromFourYearsAgoDate(): string {
  const date = today();
  date.setFullYear(date.getFullYear() - FOUR_YEARS_AGO);
  date.setMonth(LAST_MONTH_YEAR);
  date.setDate(LAST_DAY_YEAR);
  return toGermanDateFormat(date);
}

export function getStartAirportName({
  startAirport = "",
}: FluggastrechtVorabcheckUserData) {
  const airportName = getAirportNameByIataCode(startAirport);
  return airportName.length > 0 ? { startAirport: airportName } : {};
}

export function getEndAirportName({
  endAirport = "",
}: FluggastrechtVorabcheckUserData) {
  const airportName = getAirportNameByIataCode(endAirport);
  return airportName.length > 0 ? { endAirport: airportName } : {};
}

export function hasCompensationLongDistanceInsideEU({
  startAirport = "",
  endAirport = "",
}: FluggastrechtVorabcheckUserData) {
  const routeCompensation = getRouteCompensationBetweenAirports(
    startAirport,
    endAirport,
  );

  return {
    hasLongDistanceInsideEU: routeCompensation === "longDistanceInsideEU",
  };
}

export function hasCompensationLongDistanceOutsideEU({
  startAirport = "",
  endAirport = "",
}: FluggastrechtVorabcheckUserData) {
  const routeCompensation = getRouteCompensationBetweenAirports(
    startAirport,
    endAirport,
  );

  return {
    hasLongDistanceOutsideEU: routeCompensation === "longDistanceOutsideEU",
  };
}

export function hasCompensationMiddleDistance({
  startAirport = "",
  endAirport = "",
}: FluggastrechtVorabcheckUserData) {
  const routeCompensation = getRouteCompensationBetweenAirports(
    startAirport,
    endAirport,
  );

  return { hasMiddleDistance: routeCompensation === "middleDistance" };
}

export function hasCompensationShortDistance({
  startAirport = "",
  endAirport = "",
}: FluggastrechtVorabcheckUserData) {
  const routeCompensation = getRouteCompensationBetweenAirports(
    startAirport,
    endAirport,
  );

  return { hasShortDistance: routeCompensation === "shortDistance" };
}

function getAirlineByIataCode(iataCode?: string) {
  if (typeof iataCode === "undefined" || iataCode.length === 0) {
    return undefined;
  }

  return airlines.find((airline) => airline.iata === iataCode);
}

export function hasArbitrationBoardBfJ({
  fluggesellschaft,
}: FluggastrechtVorabcheckUserData) {
  const airline = getAirlineByIataCode(fluggesellschaft);

  return {
    hasArbitrationBoardBfJ:
      typeof airline === "undefined" ||
      airline?.arbitrationBoard === ARBITRATION_BOARD_BFJ ||
      airline?.arbitrationBoard === null, // a few airlines has not specified the arbitrationBoard
  };
}

export function hasArbitrationBoardRV({
  fluggesellschaft,
}: FluggastrechtVorabcheckUserData) {
  const airline = getAirlineByIataCode(fluggesellschaft);

  return {
    hasArbitrationBoardRV:
      typeof airline === "undefined" ||
      airline?.arbitrationBoard === ARBITRATION_BOARD_RV ||
      airline?.arbitrationBoard === null, // a few airlines has not specified the arbitrationBoard
  };
}

export const getButtonURLForClaimViaPost = (
  context: FluggastrechtVorabcheckUserData,
) => {
  const cameFromAnalogResultPage = isErfolgAnalog(context);
  return {
    claimViaPostButtonURL: cameFromAnalogResultPage
      ? "/fluggastrechte/vorabcheck/ergebnis/erfolg-analog"
      : "/fluggastrechte/vorabcheck/ergebnis/erfolg",
  };
};
