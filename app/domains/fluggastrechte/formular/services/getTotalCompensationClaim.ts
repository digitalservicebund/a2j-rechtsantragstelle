import {
  type CompensationClaimContext,
  getCompensationPayment,
} from "../../services/airports/getCompensationPayment";
import { getTotalClaimingPeople } from "./getTotalClaimingPeople";

export const getTotalCompensationClaim = (
  context: CompensationClaimContext,
) => {
  const { startAirport, endAirport } = context;
  const compensationByDistance = getCompensationPayment({
    startAirport,
    endAirport,
  });

  return Number(compensationByDistance) * getTotalClaimingPeople(context);
};
