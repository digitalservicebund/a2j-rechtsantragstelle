import { getAirportByIataCode } from "./getAirportByIataCode";

export const hasAirportPartnerCourt = (
  airportCode: string | undefined,
): boolean => {
  if (typeof airportCode === "undefined") {
    return false;
  }

  const pilotCourtZipCode =
    getAirportByIataCode(airportCode)?.pilotCourtZipCode ?? "";

  return pilotCourtZipCode.length > 0;
};
