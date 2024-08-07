import { getAirportNameByIataCode } from "~/services/airports/getAirportNameByIataCode";
import { getRouteCompensationBetweenAirports } from "~/services/airports/getRouteCompensationBetweenAirports";
import { FluggastrechtContext } from "./context";
import { gerichtskostenFromBetrag } from "../gerichtskosten";

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

export function getZwischenstoppAirport({
  zwischenstoppFlughafen,
}: FluggastrechtContext) {
  return { zwischenstoppAirport: zwischenstoppFlughafen };
}

export function getPersonVorname({ vorname }: FluggastrechtContext) {
  return { personVorname: vorname };
}

export function getPersonNachname({ nachname }: FluggastrechtContext) {
  return { personNachname: nachname };
}
