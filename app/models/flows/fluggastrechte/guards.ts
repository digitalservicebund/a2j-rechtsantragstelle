import { calculateDistanceBetweenAirportsInKilometers } from "~/services/airports/calculateDistanceBetweenAirports";
import { isEuropeanUnionAirport } from "~/services/airports/isEuropeanUnionAirport";
import { partnerCourtAirports } from ".";
import type { FluggastrechtVorabcheckContext } from "./context";
import { yesNoGuards, type Guards } from "../guards.server";

function isNonEUToEUFlight(context: FluggastrechtVorabcheckContext) {
  const isStartAirportEU = isEuropeanUnionAirport(context.startAirport);
  const isEndAirportEU = isEuropeanUnionAirport(context.endAirport);

  if (isStartAirportEU.isOk && isEndAirportEU.isOk) {
    return !isStartAirportEU.value && isEndAirportEU.value;
  }

  return true;
}

export const guards = {
  bereichVerspaetet: ({ context }) => context.bereich === "verspaetet",
  bereichNichtBefoerderung: ({ context }) =>
    context.bereich === "nichtbefoerderung",
  bereichAnnullierung: ({ context }) => context.bereich === "annullierung",
  isPartnerAirport: ({ context }) => {
    const airportAbbreviations = Object.keys(partnerCourtAirports);
    return (
      airportAbbreviations.includes(context.startAirport ?? "") ||
      airportAbbreviations.includes(context.endAirport ?? "")
    );
  },
  isInvalidAirportDistance: ({ context }) => {
    const distance = calculateDistanceBetweenAirportsInKilometers(
      context.startAirport ?? "",
      context.endAirport ?? "",
    );
    return distance.isErr;
  },
  isEUInboundFromNonEU: ({ context }) => {
    return isNonEUToEUFlight(context);
  },
  isEUOutbound: ({ context }) => {
    const isStartAirportEU = isEuropeanUnionAirport(context.startAirport);

    if (isStartAirportEU.isOk) {
      return isStartAirportEU.value;
    }

    return true;
  },
  isAirportOutsideEU: ({ context }) => {
    const isStartAirportEU = isEuropeanUnionAirport(context.startAirport);
    const isEndAirportEU = isEuropeanUnionAirport(context.endAirport);

    if (isStartAirportEU.isOk && isEndAirportEU.isOk) {
      return !isStartAirportEU.value && !isEndAirportEU.value;
    }

    return true;
  },
  hasBereichNichtBefoerderungAndAusgleichYes: ({ context }) => {
    if (context.bereich !== "nichtbefoerderung") {
      return false;
    }

    return context?.ausgleich === "yes";
  },
  hasBereichNichtBefoerderungAndAusgleichNo: ({ context }) => {
    if (context.bereich !== "nichtbefoerderung") {
      return false;
    }

    return context?.ausgleich === "no";
  },
  isCheckInYesBereichVerspaetet: ({ context }) => {
    return context?.bereich === "verspaetet" && context?.checkin === "yes";
  },
  isCheckInYesBereichNichtBefoerderung: ({ context }) => {
    return (
      context?.bereich === "nichtbefoerderung" && context?.checkin === "yes"
    );
  },
  isVertretbareGruendeNoBereichNichtBefoerderung: ({ context }) => {
    return (
      context?.bereich === "nichtbefoerderung" &&
      context?.vertretbareGruende === "no"
    );
  },
  isEUInboundFromNonEUBereichNichtBefoerderungAndAnnullierung: ({
    context,
  }) => {
    return (
      isNonEUToEUFlight(context) &&
      (context?.bereich === "nichtbefoerderung" ||
        context?.bereich === "annullierung")
    );
  },
  isAnkuendigungNo: ({ context }) => {
    return context.ankuendigung === "no";
  },
  isAnkuendigungUntil13Days: ({ context }) => {
    return (
      context.ankuendigung === "until6Days" ||
      context.ankuendigung === "between7And13Days"
    );
  },
  isAnkuendigungUntil13DaysAndErstazflugNo: ({ context }) => {
    return (
      (context.ankuendigung === "until6Days" ||
        context.ankuendigung === "between7And13Days") &&
      context.ersatzflug === "no"
    );
  },
  isAnkuendigungUntil6DaysAndErstazflugYes: ({ context }) => {
    return (
      context.ankuendigung === "until6Days" && context.ersatzflug === "yes"
    );
  },
  isAnkuendigungBetween7And13DaysAndErstazflugYes: ({ context }) => {
    return (
      context.ankuendigung === "between7And13Days" &&
      context.ersatzflug === "yes"
    );
  },
  isBereichAnnullierungAndVertrebareGruendeAnnullierungYes: ({ context }) => {
    return (
      context.bereich === "annullierung" &&
      context.vertretbareGruendeAnnullierung === "yes"
    );
  },
  isErsatzflugYesAndAnkuendigungUntil6Days: ({ context }) => {
    return (
      context?.ersatzflug === "yes" && context?.ankuendigung === "until6Days"
    );
  },
  isErsatzflugGelandet2StundenNoAndErstatzflugGestartet1StundeNo: ({
    context,
  }) => {
    return (
      context.ersatzflugLandenZweiStuden === "no" &&
      context.ersatzflugStartenEinStunde === "no"
    );
  },
  isErsatzflugGelandet4StundenNoAndErstatzflugGestartet2StundenNo: ({
    context,
  }) => {
    return (
      context.ersatzflugLandenVierStunden === "no" &&
      context.ersatzflugStartenZweiStunden === "no"
    );
  },
  fluggesellschaftFilled: ({ context }) =>
    Boolean(context.startAirport && context.endAirport),
  isKnownPartnerAirlineBereichVerspaetet: ({ context }) =>
    context.fluggesellschaft !== "sonstiges" &&
    context.bereich === "verspaetet",
  isKnownPartnerAirlineBereichNichtBefoerderung: ({ context }) =>
    context.fluggesellschaft !== "sonstiges" &&
    context.bereich === "nichtbefoerderung",
  ...yesNoGuards("verspaetung"),
  ...yesNoGuards("checkin"),
  ...yesNoGuards("gruende"),
  ...yesNoGuards("entschaedigung"),
  ...yesNoGuards("gericht"),
  ...yesNoGuards("abtretung"),
  ...yesNoGuards("kostenlos"),
  ...yesNoGuards("rabatt"),
  ...yesNoGuards("buchung"),
  ...yesNoGuards("verjaehrung"),
  ...yesNoGuards("ausgleich"),
  ...yesNoGuards("ausgleichAngenommen"),
  ...yesNoGuards("vertretbareGruende"),
  ...yesNoGuards("vertretbareGruendeAnnullierung"),
  ...yesNoGuards("ersatzflug"),
} satisfies Guards<FluggastrechtVorabcheckContext>;
