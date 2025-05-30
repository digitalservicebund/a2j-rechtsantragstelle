import { getAirportNameByIataCode } from "../../services/airports/getAirportNameByIataCode";
import type { FluggastrechteUserData } from "../userData";

export function getStartAirportName({
  startAirport = "",
}: FluggastrechteUserData) {
  const airportName = getAirportNameByIataCode(startAirport);
  return airportName.length > 0 ? { startAirport: airportName } : {};
}

export function getEndAirportName({ endAirport = "" }: FluggastrechteUserData) {
  const airportName = getAirportNameByIataCode(endAirport);
  return airportName.length > 0 ? { endAirport: airportName } : {};
}

export function getFirstZwischenstoppAirportName({
  ersterZwischenstopp = "",
}: FluggastrechteUserData) {
  const airportName = getAirportNameByIataCode(ersterZwischenstopp);
  return airportName.length > 0
    ? { firstZwischenstoppAirport: airportName }
    : {};
}

export function getSecondZwischenstoppAirportName({
  zweiterZwischenstopp = "",
}: FluggastrechteUserData) {
  const airportName = getAirportNameByIataCode(zweiterZwischenstopp);
  return airportName.length > 0
    ? { secondZwischenstoppAirport: airportName }
    : {};
}

export function getThirdZwischenstoppAirportName({
  dritterZwischenstopp = "",
}: FluggastrechteUserData) {
  const airportName = getAirportNameByIataCode(dritterZwischenstopp);
  return airportName.length > 0
    ? { thirdZwischenstoppAirport: airportName }
    : {};
}
