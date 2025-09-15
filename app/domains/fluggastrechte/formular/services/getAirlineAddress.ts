import { getAirlineByIataCode } from "../../services/airlines/getAirlineByIataCode";
import { type FluggastrechteUserData } from "../userData";

export const getAirlineAddress = ({
  fluggesellschaftAuswahlAdresse,
  fluggesellschaft,
  fluggesellschaftStrasseHausnummer,
  fluggesellschaftPostleitzahl,
  fluggesellschaftOrt,
  fluggesellschaftLand,
}: FluggastrechteUserData) => {
  if (fluggesellschaftAuswahlAdresse === "fromAirlineDB") {
    const airline = getAirlineByIataCode(fluggesellschaft);
    return {
      addressSource: "database",
      streetAndNumber: airline?.streetAndNumber ?? "",
      zipCode: airline?.postalCode ?? "",
      city: airline?.city ?? "",
      country: airline?.country ?? "",
    };
  }

  return {
    addressSource: "manualInput",
    streetAndNumber: fluggesellschaftStrasseHausnummer ?? "",
    zipCode: fluggesellschaftPostleitzahl ?? "",
    city: fluggesellschaftOrt ?? "",
    country: fluggesellschaftLand ?? "",
  };
};
