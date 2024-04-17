import { calculateDistanceBetweenAirportsInKilometers } from "~/util/calculateDistanceBetweenAirports";
import type { FluggastrechtVorabcheckContext } from "./context";

export const COMPENSATION_VALUE_UNTIL_1500_KM = "250";
export const COMPENSATION_VALUE_UNTIL_3000_KM = "400";
export const COMPENSATION_VALUE_ABOVE_3000_KM = "600";

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
