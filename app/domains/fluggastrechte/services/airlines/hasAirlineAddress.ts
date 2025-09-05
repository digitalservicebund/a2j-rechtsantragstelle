import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import { getAirlineByIataCode } from "./getAirlineByIataCode";

export function hasAirlineAddress(iataCode: string) {
  const airline = getAirlineByIataCode(iataCode);
  return objectKeysNonEmpty(airline, [
    "streetAndNumber",
    "postalCode",
    "city",
    "country",
  ]);
}
