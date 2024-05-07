import { calculateDistanceBetweenAirportsInKilometers } from "~/util/calculateDistanceBetweenAirports";
import type { FluggastrechtVorabcheckContext } from "./context";
import { toGermanDateFormat, today } from "~/services/validation/date";

export const COMPENSATION_VALUE_UNTIL_1500_KM = "250";
export const COMPENSATION_VALUE_UNTIL_3000_KM = "400";
export const COMPENSATION_VALUE_ABOVE_3000_KM = "600";
const FOUR_YEARS_AGO = 4;
const LAST_DAY_YEAR = 31;
const LAST_MONTH_YEAR = 11; // Date.setMonth starts from 0 to 11, where 11 is December

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
