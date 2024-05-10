import { calculateDistanceBetweenAirportsInKilometers } from "~/util/calculateDistanceBetweenAirports";
import type { FluggastrechtVorabcheckContext } from "./context";
import { toGermanDateFormat, today } from "~/services/validation/date";
import airports from "data/airports/data.json";
import type { Translations } from "~/services/cms/index.server";
import { getTranslationByKey } from "~/util/getTranslationByKey";

export const COMPENSATION_VALUE_UNTIL_1500_KM = "250";
export const COMPENSATION_VALUE_UNTIL_3000_KM = "400";
export const COMPENSATION_VALUE_ABOVE_3000_KM = "600";
const FOUR_YEARS_AGO = 4;
const LAST_DAY_YEAR = 31;
const LAST_MONTH_YEAR = 11; // Date.setMonth starts from 0 to 11, where 11 is December

export const TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_UNTIL_1500_KM =
  "route-compensation-description-until-1500-km";
export const TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_UNTIL_3000_KM =
  "route-compensation-description-until-3000-km";
export const TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_ABOVE_3000_KM =
  "route-compensation-description-above-3000-km";

export function getCompensantionPaymentString({
  startAirport = "",
  endAirport = "",
}: FluggastrechtVorabcheckContext) {
  const distanceKm = calculateDistanceBetweenAirportsInKilometers(
    startAirport,
    endAirport,
  );

  if (distanceKm.isOk) {
    let compensationValue = COMPENSATION_VALUE_UNTIL_1500_KM;

    if (distanceKm.value > 3000) {
      compensationValue = COMPENSATION_VALUE_ABOVE_3000_KM;
    } else if (distanceKm.value > 1500) {
      compensationValue = COMPENSATION_VALUE_UNTIL_3000_KM;
    }

    return {
      compensationPayment: compensationValue,
    };
  }

  return {};
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
  const distanceKm = calculateDistanceBetweenAirportsInKilometers(
    startAirport,
    endAirport,
  );

  if (distanceKm.isOk) {
    let routeCompensationDescriptionValue = getTranslationByKey(
      TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_UNTIL_1500_KM,
      translations,
    );

    if (distanceKm.value > 3000) {
      routeCompensationDescriptionValue = getTranslationByKey(
        TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_ABOVE_3000_KM,
        translations,
      );
    } else if (distanceKm.value > 1500) {
      routeCompensationDescriptionValue = getTranslationByKey(
        TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_UNTIL_3000_KM,
        translations,
      );
    }

    return {
      routeCompensationDescription: routeCompensationDescriptionValue,
    };
  }

  return {};
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
