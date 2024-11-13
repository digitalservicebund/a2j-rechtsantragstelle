import { getAirportByIataCode } from "~/domains/fluggastrechte/services/airports/getAirportByIataCode";
import { findCourt } from "~/services/gerichtsfinder/amtsgerichtData.server";
import type { Jmtd14VTErwerberGerbeh } from "~/services/gerichtsfinder/types";

export const getCourtByStartAndEndAirport = (
  startIataCodeAirport: string,
  endIataCodeAirport: string,
): Jmtd14VTErwerberGerbeh | undefined => {
  const startAirport = getAirportByIataCode(startIataCodeAirport);
  const endAirport = getAirportByIataCode(endIataCodeAirport);

  if (
    typeof startAirport === "undefined" ||
    typeof endAirport === "undefined"
  ) {
    return undefined;
  }

  if (
    startAirport.zipCodePilotCourt.length === 0 &&
    endAirport.zipCodePilotCourt.length === 0
  ) {
    return undefined;
  }

  const zipCodePilotCourt =
    startAirport.zipCodePilotCourt.length > 0
      ? startAirport.zipCodePilotCourt
      : endAirport.zipCodePilotCourt;

  return findCourt({ zipCode: zipCodePilotCourt });
};
