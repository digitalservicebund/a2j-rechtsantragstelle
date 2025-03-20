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

  // departure outside EU only Destination in DE
  if (!isStartAirportInEu && isEndAirportGerman) {
    // destination without partner court
    return (
      !hasEndAirportPartnerCourt &&
      isAirlineInEu &&
      fluggesellschaft !== "sonstiges"
    );
  }

  // only departure DE or both in DE
  if (isStartAirportGerman) {
    // both airports have no partner court or fluggesellschaft is "sonstiges"
    return (
      (!hasStartAirportPartnerCourt && !hasEndAirportPartnerCourt) ||
      fluggesellschaft === "sonstiges"
    );
  }

  // departure in EU and destination in DE
  if (isStartAirportInEu && isEndAirportGerman) {
    return !hasEndAirportPartnerCourt || fluggesellschaft === "sonstiges";
  }

  return false;
};
