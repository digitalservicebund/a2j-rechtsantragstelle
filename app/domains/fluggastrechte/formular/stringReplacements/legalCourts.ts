import { gerichtskostenFromBetrag } from "~/domains/geldEinklagen/shared/gerichtskosten";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import { getAirportByIataCode } from "../../services/airports/getAirportByIataCode";
import { getCompensationPayment } from "../../services/airports/getCompensationPayment";
import { getCourtByStartAndEndAirport } from "../../services/getCourtByStartAndEndAirport";
import { getTotalClaimingPeople } from "../services/getTotalClaimingPeople";
import { getTotalCompensationClaim } from "../services/getTotalCompensationClaim";
import type { FluggastrechteUserData } from "../userData";

export const hasBothAirportsPartnerCourts = (
  context: FluggastrechteUserData,
) => {
  const startAirport = getAirportByIataCode(context.startAirport ?? "");
  const endAirport = getAirportByIataCode(context.endAirport ?? "");

  return {
    hasBothAirportsPartnerCourts:
      objectKeysNonEmpty(startAirport, ["zipCodePilotCourt"]) &&
      objectKeysNonEmpty(endAirport, ["zipCodePilotCourt"]),
  };
};

export const getResponsibleAirportForCourt = (
  context: FluggastrechteUserData,
) => {
  const startAirport = getAirportByIataCode(context.startAirport ?? "");
  const isStartAirportResponsible =
    startAirport && startAirport.zipCodePilotCourt.length > 0;
  return {
    responsibleAirportForCourt: isStartAirportResponsible
      ? "Startflughafen"
      : "Zielflughafen",
  };
};

export const getResponsibleCourt = (context: FluggastrechteUserData) => {
  const court = getCourtByStartAndEndAirport(
    context.startAirport ?? "",
    context.endAirport ?? "",
  );
  if (court)
    return {
      courtName: court.BEZEICHNUNG,
      courtStreetAndNumber: court.STR_HNR,
      courtZipCode: court.PLZ_ZUSTELLBEZIRK,
      courtCity: court.ORT,
      courtWebsite: court.URL1 ?? "",
      courtTelephone: court.TEL ?? "",
      courtTelephoneNoSpace: court.TEL?.replace(/\s/g, "") ?? "",
    };
  return {};
};

export const getStreitwert = (context: FluggastrechteUserData) => {
  const totalCompensation = getTotalCompensationClaim(context);
  return {
    courtCost: gerichtskostenFromBetrag(totalCompensation).toString(),
    singleCompensation: getCompensationPayment({
      startAirport: context.startAirport,
      endAirport: context.endAirport,
    }),
    totalClaimingPeople: getTotalClaimingPeople(context).toString(),
    totalCompensation: totalCompensation.toString(),
  };
};
