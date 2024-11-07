import { getAirlineNameByIataCode } from "~/services/airlines/getAirlineNameByIataCode";
import { getAirportNameByIataCode } from "~/services/airports/getAirportNameByIataCode";
import type { FluggastrechtContext } from "./context";

export const WEITERE_PERSONEN_START_INDEX = 2;

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

export function getFirstZwischenstoppAirportName({
  ersterZwischenstopp = "",
}: FluggastrechtContext) {
  const airportName = getAirportNameByIataCode(ersterZwischenstopp);
  return airportName.length > 0
    ? { firstZwischenstoppAirport: airportName }
    : {};
}

export function getSecondZwischenstoppAirportName({
  zweiterZwischenstopp = "",
}: FluggastrechtContext) {
  const airportName = getAirportNameByIataCode(zweiterZwischenstopp);
  return airportName.length > 0
    ? { secondZwischenstoppAirport: airportName }
    : {};
}

export function getThirdZwischenstoppAirportName({
  dritterZwischenstopp = "",
}: FluggastrechtContext) {
  const airportName = getAirportNameByIataCode(dritterZwischenstopp);
  return airportName.length > 0
    ? { thirdZwischenstoppAirport: airportName }
    : {};
}

export function isVerspaetet({ bereich = "" }: FluggastrechtContext) {
  return {
    isVerspaetet: bereich === "verspaetet",
  };
}

export function isNichtBefoerderung({ bereich = "" }: FluggastrechtContext) {
  return {
    isNichtBefoerderung: bereich === "nichtbefoerderung",
  };
}

export function isAnnullierung({ bereich = "" }: FluggastrechtContext) {
  return {
    isAnnullierung: bereich === "annullierung",
  };
}

export function isWeiterePersonen({ isWeiterePersonen }: FluggastrechtContext) {
  return {
    isWeiterePersonen: isWeiterePersonen === "yes",
  };
}

export function getAirlineName({
  fluggesellschaft = "",
}: FluggastrechtContext) {
  if (fluggesellschaft.length === 0) {
    return {};
  }

  const airlineName = getAirlineNameByIataCode(fluggesellschaft);

  return airlineName.length > 0 ? { airlineName: airlineName } : {};
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
