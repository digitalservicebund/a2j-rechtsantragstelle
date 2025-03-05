import { hasAirportPartnerCourt } from "~/domains/fluggastrechte/services/airports/hasPartnerCourt";
import { isGermanAirport } from "~/domains/fluggastrechte/services/airports/isGermanAirport";
import type { FluggastrechtVorabcheckContext } from "../context";
import { isFluggesellschaftInEU } from "./isFluggesellschaftInEU";
import { isEuropeanUnionAirport } from "../../services/airports/isEuropeanUnionAirport";

export const isErfolgAnalog = ({
  startAirport,
  endAirport,
  gericht,
  fluggesellschaft,
}: FluggastrechtVorabcheckContext) => {
  // If the case is already in court, it's not an Analog success
  if (gericht === "yes") {
    return false;
  }

  const hasStartAirportPartnerCourt = hasAirportPartnerCourt(startAirport);
  const hasEndAirportPartnerCourt = hasAirportPartnerCourt(endAirport);

  const isStartAirportGerman = isGermanAirport(startAirport);
  const isEndAirportGerman = isGermanAirport(endAirport);
  const isAirlineInEu = isFluggesellschaftInEU(fluggesellschaft);
  const isStartAirportInEu = isEuropeanUnionAirport(startAirport);

  // only with german destination
  if (
    isEndAirportGerman &&
    !isStartAirportGerman &&
    !hasEndAirportPartnerCourt &&
    ((isAirlineInEu && fluggesellschaft !== "sonstiges") || isStartAirportInEu)
  ) {
    return true;
  }

  // german departure without partner court
  if (
    isStartAirportGerman &&
    !hasStartAirportPartnerCourt &&
    !hasEndAirportPartnerCourt
  ) {
    return true;
  }

  // german departure with partner court either in departure or destination
  return (
    isStartAirportGerman &&
    (hasStartAirportPartnerCourt || hasEndAirportPartnerCourt) &&
    fluggesellschaft === "sonstiges"
  );
};
