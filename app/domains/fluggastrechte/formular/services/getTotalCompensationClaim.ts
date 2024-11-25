import { getCompensationPayment } from "../../services/airports/getCompensationPayment";
import type { FluggastrechtContext } from "../context";
import { getTotalClaimingPeople } from "./getTotalClaimingPeople";

export const getTotalCompensationClaim = (context: FluggastrechtContext) => {
  const { startAirport, endAirport } = context;
  const compensationByDistance = getCompensationPayment({
    startAirport,
    endAirport,
  });

  return Number(compensationByDistance) * getTotalClaimingPeople(context);
};
