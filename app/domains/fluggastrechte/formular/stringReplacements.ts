import { gerichtskostenFromBetrag } from "~/domains/geldEinklagen/shared/gerichtskosten";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import type { FluggastrechteUserData } from "./userData";
import { getAirlineNameByIataCode } from "../services/airlines/getAirlineNameByIataCode";
import { getAirportByIataCode } from "../services/airports/getAirportByIataCode";
import { getAirportNameByIataCode } from "../services/airports/getAirportNameByIataCode";
import { getCourtByStartAndEndAirport } from "../services/getCourtByStartAndEndAirport";
import { getTotalClaimingPeople } from "./services/getTotalClaimingPeople";
import { getTotalCompensationClaim } from "./services/getTotalCompensationClaim";
import { getCompensationPayment } from "../services/airports/getCompensationPayment";

export const WEITERE_PERSONEN_START_INDEX = 2;

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

export function isVerspaetet({ bereich = "" }: FluggastrechteUserData) {
  return {
    isVerspaetet: bereich === "verspaetet",
  };
}

export function isNichtBefoerderung({ bereich = "" }: FluggastrechteUserData) {
  return {
    isNichtBefoerderung: bereich === "nichtbefoerderung",
  };
}

export function isAnnullierung({ bereich = "" }: FluggastrechteUserData) {
  return {
    isAnnullierung: bereich === "annullierung",
  };
}

export function isWeiterePersonen({
  isWeiterePersonen,
}: FluggastrechteUserData) {
  return {
    isWeiterePersonen: isWeiterePersonen === "yes",
  };
}

export function getAirlineName({
  fluggesellschaft = "",
}: FluggastrechteUserData) {
  if (fluggesellschaft.length === 0) {
    return {};
  }

  const airlineName = getAirlineNameByIataCode(fluggesellschaft);

  return airlineName.length > 0 ? { airlineName: airlineName } : {};
}

export function getPersonVorname({ vorname }: FluggastrechteUserData) {
  return { personVorname: vorname };
}

export function getPersonNachname({ nachname }: FluggastrechteUserData) {
  return { personNachname: nachname };
}

export const getArrayWeiterePersonenIndexStrings = (
  context: FluggastrechteUserData,
) => {
  const arrayIndex = context.pageData?.arrayIndexes.at(0);
  return typeof arrayIndex !== "undefined"
    ? {
        "arrayWeiterePersonen#index": String(
          arrayIndex + WEITERE_PERSONEN_START_INDEX,
        ),
      }
    : {};
};

export const getWeiterePersonenNameStrings = (
  context: FluggastrechteUserData,
) => {
  const arrayIndex = context.pageData?.arrayIndexes.at(0);
  if (
    typeof arrayIndex === "undefined" ||
    !context.weiterePersonen ||
    arrayIndex > context.weiterePersonen.length + 1
  )
    return {};
  if (arrayIndex < context.weiterePersonen.length)
    return {
      "weiterePersonen#vorname": context.weiterePersonen?.[arrayIndex].vorname,
      "weiterePersonen#nachname":
        context.weiterePersonen?.[arrayIndex].nachname,
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

export const getAnnullierungInfo = (context: FluggastrechteUserData) => {
  return {
    hasAnnullierungCase: context.bereich === "annullierung",
    hasNoAnkuendigung: context.ankuendigung === "no",
    hasUntil6DaysAnkuendigung: context.ankuendigung === "until6Days",
    hasBetween7And13DaysAnkuendigung:
      context.ankuendigung === "between7And13Days",
    hasMoreThan13DaysAnkuendigung: context.ankuendigung === "moreThan13Days",
    hasErsatzverbindungAngebot: context.ersatzflug === "yes",
    hasErsatzflugLandenZweiStunden:
      context.ersatzflugLandenZweiStunden === "yes",
    hasErsatzflugLandenVierStunden:
      context.ersatzflugLandenVierStunden === "yes",
    hasErsatzflugStartenEinStunde: context.ersatzflugStartenEinStunde === "yes",
    hasErsatzflugStartenZweiStunden:
      context.ersatzflugStartenZweiStunden === "yes",
  };
};

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
