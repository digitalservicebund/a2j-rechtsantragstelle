import airlines from "data/airlines/data.json";
import { getAirportNameByIataCode } from "~/services/airports/getAirportNameByIataCode";
import { getRouteCompensationBetweenAirports } from "~/services/airports/getRouteCompensationBetweenAirports";
import type { FluggastrechtContext } from "./context";
import { gerichtskostenFromBetrag } from "../gerichtskosten";

export const WEITERE_PERSONEN_START_INDEX = 2;

function forderungFromAirports(startAirport: string, endAirport: string) {
  const routeCompensation = getRouteCompensationBetweenAirports(
    startAirport,
    endAirport,
  );

  switch (routeCompensation) {
    case "notPossibleCalculateDistance": {
      return 0;
    }
    case "shortDistance": {
      return 250;
    }
    case "longDistanceInsideEU":
    case "middleDistance": {
      return 400;
    }
    case "longDistanceOutsideEU": {
      return 600;
    }
  }
}

export function getStartAirportName({
  startAirport = "",
}: FluggastrechtContext) {
  const airportName = getAirportNameByIataCode(startAirport);
  return airportName.length > 0 ? { startAirport: airportName } : {};
}

export function getEndAirportName({ endAirport = "" }: FluggastrechtContext) {
  const airportName = getAirportNameByIataCode(endAirport);
  return airportName.length > 0 ? { endAirport: airportName } : {};
}

function getAirlinenNameByIataCode(iataCode?: string) {
  if (typeof iataCode === "undefined" || iataCode.length === 0) {
    return "";
  }
  const airline = airlines.find((airline) => airline.iata === iataCode);

  return airline?.name ?? "";
}

export function getAirlineName({
  fluggesellschaft = "",
}: FluggastrechtContext) {
  if (fluggesellschaft.length === 0) {
    return {};
  }

  const airlineName = getAirlinenNameByIataCode(fluggesellschaft);

  return airlineName.length > 0 ? { airlineName: airlineName } : {};
}

export function getForderung({
  startAirport = "",
  endAirport = "",
}: FluggastrechtContext) {
  return {
    forderung: forderungFromAirports(startAirport, endAirport).toString(),
  };
}

export function getGerichtskostenFromBetrag({
  startAirport = "",
  endAirport = "",
}: FluggastrechtContext) {
  return {
    kosten: gerichtskostenFromBetrag(
      forderungFromAirports(startAirport, endAirport),
    ).toString(),
  };
}

export function getPersonVorname({ vorname }: FluggastrechtContext) {
  return { personVorname: vorname };
}

export function getPersonNachname({ nachname }: FluggastrechtContext) {
  return { personNachname: nachname };
}

export const getArrayWeiterePersonenIndexStrings = (
  context: FluggastrechtContext,
) => {
  const arrayIndex = context.pageData?.arrayIndexes.at(0);
  return typeof arrayIndex !== "undefined"
    ? {
        "arrayWeiterePersonen#index": String(
          arrayIndex + WEITERE_PERSONEN_START_INDEX,
        ),
      }
    : {};
};

export const getWeiterePersonenNameStrings = (
  context: FluggastrechtContext,
) => {
  const arrayIndex = context.pageData?.arrayIndexes.at(0);
  if (
    typeof arrayIndex === "undefined" ||
    !context.weiterePersonen ||
    arrayIndex > context.weiterePersonen.length + 1
  )
    return {};
  if (arrayIndex < context.weiterePersonen.length)
    return {
      "weiterePersonen#vorname": context.weiterePersonen?.[arrayIndex].vorname,
      "weiterePersonen#nachname":
        context.weiterePersonen?.[arrayIndex].nachname,
    };
};
