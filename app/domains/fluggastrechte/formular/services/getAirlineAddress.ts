import { getAirlineByIataCode } from "../../services/airlines/getAirlineByIataCode";
import { type FluggastrechteUserData } from "../userData";

export const getAirlineAddress = ({
  fluggesellschaftAuswahlAddress,
  fluggesellschaft,
  fluggesellschaftStrasseHausnummer,
  fluggesellschaftPostleitzahl,
  fluggesellschaftOrt,
  fluggesellschaftLand,
}: FluggastrechteUserData) => {
  if (fluggesellschaftAuswahlAddress === "fromAirlineDB") {
    const airline = getAirlineByIataCode(fluggesellschaft);
    return {
      address: airline?.streetAndNumber ?? "",
      zipCode: airline?.postalCode ?? "",
      city: airline?.city ?? "",
      country: airline?.country ?? "",
    };
  }

  return {
    address: fluggesellschaftStrasseHausnummer ?? "",
    zipCode: fluggesellschaftPostleitzahl ?? "",
    city: fluggesellschaftOrt ?? "",
    country: fluggesellschaftLand ?? "",
  };
};
