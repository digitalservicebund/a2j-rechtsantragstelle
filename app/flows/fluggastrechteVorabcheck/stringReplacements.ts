import airports from "data/airports/data.json";
import { getRouteCompensationBetweenAirports } from "~/services/airports/getRouteCompensationBetweenAirports";
import type { Translations } from "~/services/cms/index.server";
import { toGermanDateFormat, today } from "~/util/date";
import { getTranslationByKey } from "~/util/getTranslationByKey";
import type { FluggastrechtVorabcheckContext } from "./context";

export const COMPENSATION_VALUE_250 = "250";
export const COMPENSATION_VALUE_400 = "400";
export const COMPENSATION_VALUE_600 = "600";
const FOUR_YEARS_AGO = 4;
const LAST_DAY_YEAR = 31;
const LAST_MONTH_YEAR = 11; // Date.setMonth starts from 0 to 11, where 11 is December

export const TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_UNTIL_1500_KM =
  "route-compensation-description-until-1500-km";
export const TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_UNTIL_3500_KM =
  "route-compensation-description-until-3500-km";
export const TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_ABOVE_3500_KM_INSIDE_EU =
  "route-compensation-description-above-3500-km-inside-eu";
export const TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_ABOVE_3500_KM_OUTSIDE_EU =
  "route-compensation-description-above-3500-km-outside-eu";

export function getCompensantionPaymentString({
  startAirport = "",
  endAirport = "",
}: FluggastrechtVorabcheckContext) {
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
    default: {
      return {};
    }
  }
}

export function getLastDaytFromFourYearsAgoDate(): string {
  const date = today();
  date.setFullYear(date.getFullYear() - FOUR_YEARS_AGO);
  date.setMonth(LAST_MONTH_YEAR);
  date.setDate(LAST_DAY_YEAR);
  return toGermanDateFormat(date);
}

export function getStartAirportName({
  startAirport = "",
}: FluggastrechtVorabcheckContext) {
  const airportName = getAirportName(startAirport);
  return airportName.length > 0 ? { startAirport: airportName } : {};
}

export function getEndAirportName({
  endAirport = "",
}: FluggastrechtVorabcheckContext) {
  const airportName = getAirportName(endAirport);
  return airportName.length > 0 ? { endAirport: airportName } : {};
}

export function getRouteCompensationDescription(
  { startAirport = "", endAirport = "" }: FluggastrechtVorabcheckContext,
  translations: Translations,
) {
  const routeCompensation = getRouteCompensationBetweenAirports(
    startAirport,
    endAirport,
  );

  let translationKey = "";

  switch (routeCompensation) {
    case "longDistanceInsideEU":
      translationKey =
        TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_ABOVE_3500_KM_INSIDE_EU;
      break;
    case "longDistanceOutsideEU":
      translationKey =
        TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_ABOVE_3500_KM_OUTSIDE_EU;
      break;
    case "middleDistance":
      translationKey = TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_UNTIL_3500_KM;
      break;
    case "shortDistance":
      translationKey = TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_UNTIL_1500_KM;
      break;
    default: {
      return {};
    }
  }

  return {
    routeCompensationDescription: getTranslationByKey(
      translationKey,
      translations,
    ),
  };
}

function getAirportName(airportIataCode: string): string {
  if (airportIataCode.length > 0) {
    const airport = airports.find((aiport) => aiport.iata === airportIataCode);

    if (airport) {
      return airport.airport.includes(airport.city)
        ? `${airport.airport} (${airport.iata})`
        : `${airport.city} ${airport.airport} (${airport.iata})`;
    }
  }

  return "";
}
