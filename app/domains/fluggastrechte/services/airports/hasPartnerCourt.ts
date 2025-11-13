import { getAirportByIataCode } from "./getAirportByIataCode";

export const hasAirportPartnerCourt = (
  airportCode: string | undefined,
): boolean => {
  if (!airportCode) return false;

  const zipCodePilotCourt =
    getAirportByIataCode(airportCode)?.zipCodePilotCourt ?? "";

  return zipCodePilotCourt.length > 0;
};
