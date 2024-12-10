import { getCompensationPayment } from "../../services/airports/getCompensationPayment";
import type { FluggastrechtContext } from "../context";
import { getTotalCompensationClaim } from "./getTotalCompensationClaim";

const MAX_TOTAL_COMPENSATION = 5000;

export const isTotalClaimWillSucceddedAboveLimit = (
  context: FluggastrechtContext,
): boolean => {
  const { startAirport, endAirport } = context;
  const currentTotalCompensation = getTotalCompensationClaim(context);
  const compensationValue = getCompensationPayment({
    startAirport,
    endAirport,
  });

  return (
    currentTotalCompensation + Number(compensationValue) >
    MAX_TOTAL_COMPENSATION
  );
};
