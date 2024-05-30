import { calculateDistanceBetweenAirportsInKilometers } from "~/util/calculateDistanceBetweenAirports";
import { EUCountries, partnerCourtAirports } from ".";
import { yesNoGuards, type Guards } from "../guards.server";
import type { FluggastrechtVorabcheckContext } from "./context";
import airports from "data/airports/data.json";

function getCountryCodeByIata(airportIata: string | undefined) {
  return airports.find((airport) => airport.iata === airportIata)?.country_code;
}

function isNonEUToEUFlight(context: FluggastrechtVorabcheckContext) {
  const startAirportByIata = getCountryCodeByIata(context.startAirport);
  const endAirportByIata = getCountryCodeByIata(context.endAirport);

  if (
    typeof startAirportByIata === "undefined" ||
    typeof endAirportByIata === "undefined"
  ) {
    return true;
  }

  return (
    !EUCountries.includes(startAirportByIata) &&
    EUCountries.includes(endAirportByIata)
  );
}

export const guards = {
  bereichVerspaetet: ({ context }) => context.bereich === "verspaetet",
  bereichNichtBefoerderung: ({ context }) =>
    context.bereich === "nichtbefoerderung",
  bereichAnnullierung: ({ context }) => context.bereich === "annulierung",
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
    const startAirportByIata = getCountryCodeByIata(context.startAirport);

    if (typeof startAirportByIata === "undefined") {
      return true;
    }
    return EUCountries.includes(startAirportByIata);
  },
  isAirportOutsideEU: ({ context }) => {
    const startAirportByIata = getCountryCodeByIata(context.startAirport);
    const endAirportByIata = getCountryCodeByIata(context.endAirport);

    if (
      typeof startAirportByIata === "undefined" ||
      typeof endAirportByIata === "undefined"
    ) {
      return true;
    }

    return (
      !EUCountries.includes(startAirportByIata) &&
      !EUCountries.includes(endAirportByIata)
    );
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
        context?.bereich === "annulierung")
    );
  },
  isAnkuendigungNo: ({ context }) => {
    return context.ankuendigung === "no";
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
      context.bereich === "annulierung" &&
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
