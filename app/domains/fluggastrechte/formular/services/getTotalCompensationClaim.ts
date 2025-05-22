import { getCompensationPayment } from "../../services/airports/getCompensationPayment";
import type { FluggastrechteUserData } from "../userData";
import { getTotalClaimingPeople } from "./getTotalClaimingPeople";

export const getTotalCompensationClaim = (context: FluggastrechteUserData) => {
  const { startAirport, endAirport } = context;
  const compensationByDistance = getCompensationPayment({
    startAirport,
    endAirport,
  });

  return Number(compensationByDistance) * getTotalClaimingPeople(context);
};
