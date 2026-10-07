import {
  type CompensationClaimContext,
  getCompensationPayment,
} from "../../services/airports/getCompensationPayment";
import { getTotalCompensationClaim } from "./getTotalCompensationClaim";

export const MAX_TOTAL_COMPENSATION = 10000;

export const isTotalClaimWillSucceddedAboveLimit = (
  context: CompensationClaimContext,
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
