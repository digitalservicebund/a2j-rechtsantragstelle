import { getAirlineNameByIataCode } from "../../services/airlines/getAirlineNameByIataCode";
import type { FluggastrechteUserData } from "../userData";

export function getAirlineName({
  fluggesellschaft = "",
}: FluggastrechteUserData) {
  if (fluggesellschaft.length === 0) {
    return {};
  }

  const airlineName = getAirlineNameByIataCode(fluggesellschaft);

  return airlineName.length > 0 ? { airlineName: airlineName } : {};
}
