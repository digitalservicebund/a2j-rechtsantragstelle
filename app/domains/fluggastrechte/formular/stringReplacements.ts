import { gerichtskostenFromBetrag } from "~/domains/geldEinklagen/shared/gerichtskosten";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import type { FluggastrechtContext } from "./context";
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
}: FluggastrechtContext) {
  const airportName = getAirportNameByIataCode(startAirport);
  return airportName.length > 0 ? { startAirport: airportName } : {};
}

export function getEndAirportName({ endAirport = "" }: FluggastrechtContext) {
  const airportName = getAirportNameByIataCode(endAirport);
  return airportName.length > 0 ? { endAirport: airportName } : {};
}

export function getFirstZwischenstoppAirportName({
  ersterZwischenstopp = "",
}: FluggastrechtContext) {
  const airportName = getAirportNameByIataCode(ersterZwischenstopp);
  return airportName.length > 0
    ? { firstZwischenstoppAirport: airportName }
    : {};
}

export function getSecondZwischenstoppAirportName({
  zweiterZwischenstopp = "",
}: FluggastrechtContext) {
  const airportName = getAirportNameByIataCode(zweiterZwischenstopp);
  return airportName.length > 0
    ? { secondZwischenstoppAirport: airportName }
    : {};
}

export function getThirdZwischenstoppAirportName({
  dritterZwischenstopp = "",
}: FluggastrechtContext) {
  const airportName = getAirportNameByIataCode(dritterZwischenstopp);
  return airportName.length > 0
    ? { thirdZwischenstoppAirport: airportName }
    : {};
}

export function isVerspaetet({ bereich = "" }: FluggastrechtContext) {
  return {
    isVerspaetet: bereich === "verspaetet",
  };
}

export function isNichtBefoerderung({ bereich = "" }: FluggastrechtContext) {
  return {
    isNichtBefoerderung: bereich === "nichtbefoerderung",
  };
}

export function isAnnullierung({ bereich = "" }: FluggastrechtContext) {
  return {
    isAnnullierung: bereich === "annullierung",
  };
}

export function isWeiterePersonen({ isWeiterePersonen }: FluggastrechtContext) {
  return {
    isWeiterePersonen: isWeiterePersonen === "yes",
  };
}

export function getAirlineName({
  fluggesellschaft = "",
}: FluggastrechtContext) {
  if (fluggesellschaft.length === 0) {
    return {};
  }

  const airlineName = getAirlineNameByIataCode(fluggesellschaft);

  return airlineName.length > 0 ? { airlineName: airlineName } : {};
}

export function getPersonVorname({ vorname }: FluggastrechtContext) {
  return { personVorname: vorname };
}

export function getPersonNachname({ nachname }: FluggastrechtContext) {
  return { personNachname: nachname };
}

export const getArrayWeiterePersonenIndexStrings = (
  context: FluggastrechtContext,
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
  context: FluggastrechtContext,
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

export const getResponsibleCourt = (context: FluggastrechtContext) => {
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

export const getStreitwert = (context: FluggastrechtContext) => {
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

export const getAnnullierungInfo = (context: FluggastrechtContext) => {
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

export const hasBothAirportsPartnerCourts = (context: FluggastrechtContext) => {
  const startAirport = getAirportByIataCode(context.startAirport ?? "");
  const endAirport = getAirportByIataCode(context.endAirport ?? "");

  return {
    hasBothAirportsPartnerCourts:
      objectKeysNonEmpty(startAirport, ["zipCodePilotCourt"]) &&
      objectKeysNonEmpty(endAirport, ["zipCodePilotCourt"]),
  };
};

export const getResponsibleAirportForCourt = (
  context: FluggastrechtContext,
) => {
  const startAirport = getAirportByIataCode(context.startAirport ?? "");
  const isStartAirportResponsible =
    (startAirport?.zipCodePilotCourt?.length ?? 0) > 0;
  return {
    responsibleAirportForCourt: isStartAirportResponsible
      ? "Startflughafen"
      : "Zielflughafen",
  };
};
