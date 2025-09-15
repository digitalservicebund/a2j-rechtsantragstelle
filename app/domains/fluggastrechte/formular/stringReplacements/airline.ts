import { getAirlineByIataCode } from "../../services/airlines/getAirlineByIataCode";
import { getAirlineNameByIataCode } from "../../services/airlines/getAirlineNameByIataCode";
import { getAirlineAddress } from "../services/getAirlineAddress";
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

export function getAirlineAddressFromDB({
  fluggesellschaft = "",
}: FluggastrechteUserData) {
  const airline = getAirlineByIataCode(fluggesellschaft);

  if (typeof airline === "undefined") {
    return {};
  }

  return {
    airlineStreetAndNumberDB: airline.streetAndNumber,
    airlinePostalCodeDB: airline.postalCode,
    airlineCityDB: airline.city,
    airlineCountryDB: airline.country,
  };
}

export function getAirlineAddressString(context: FluggastrechteUserData) {
  const { addressSource, streetAndNumber, city, country, zipCode } =
    getAirlineAddress(context);

  return {
    isAirlineAddressFromDB: addressSource === "database",
    airlineStreetAndNumber: streetAndNumber,
    airlinePostalCode: zipCode,
    airlineCity: city,
    airlineCountry: country,
  };
}
