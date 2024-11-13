import { getCompensationPayment } from "~/services/airports/getCompensationPayment";
import type { FluggastrechtContext } from "../context";

export const getTotalCompensationClaim = (context: FluggastrechtContext) => {
  const { startAirport, endAirport, weiterePersonen } = context;
  const totalClaimPeople =
    1 + (typeof weiterePersonen !== "undefined" ? weiterePersonen.length : 0);
  const compensationByDistance = getCompensationPayment({
    startAirport,
    endAirport,
  });

  return Number(compensationByDistance) * totalClaimPeople;
};
