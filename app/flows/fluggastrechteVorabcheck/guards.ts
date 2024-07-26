import airlines from "data/airlines/data.json";
import { calculateDistanceBetweenAirportsInKilometers } from "~/services/airports/calculateDistanceBetweenAirports";
import { isEuropeanUnionAirport } from "~/services/airports/isEuropeanUnionAirport";
import type { FluggastrechtVorabcheckContext } from "./context";
import { yesNoGuards, type Guards } from "../guards.server";

export const guards = {
  bereichVerspaetet: ({ context }) => context.bereich === "verspaetet",
  bereichNichtBefoerderung: ({ context }) =>
    context.bereich === "nichtbefoerderung",
  bereichAnnullierung: ({ context }) => context.bereich === "annullierung",
  isInvalidAirportDistance: ({ context }) => {
    const distance = calculateDistanceBetweenAirportsInKilometers(
      context.startAirport ?? "",
      context.endAirport ?? "",
    );
    return distance.isErr;
  },
  isAirportOutsideEU: ({ context }) => {
    const isStartAirportEU = isEuropeanUnionAirport(context.startAirport);
    const isEndAirportEU = isEuropeanUnionAirport(context.endAirport);

    if (isStartAirportEU.isOk && isEndAirportEU.isOk) {
      return !isStartAirportEU.value && !isEndAirportEU.value;
    }

    return true;
  },
  isVertretbareGruendeNoBereichNichtBefoerderung: ({ context }) => {
    return (
      context?.bereich === "nichtbefoerderung" &&
      context?.vertretbareGruende === "no"
    );
  },
  isAnkuendigungMoreThan13Days: ({ context }) => {
    return context.ankuendigung === "moreThan13Days";
  },
  isErsatzflugNoAndNotAnkuendigungMoreThan13Days: ({ context }) => {
    return (
      context.ankuendigung !== "moreThan13Days" && context.ersatzflug === "no"
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
  isErsatzflugYesAndAnkuendigungUntil6DaysOrNo: ({ context }) => {
    return (
      context?.ersatzflug === "yes" &&
      (context?.ankuendigung === "until6Days" || context?.ankuendigung === "no")
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
  isKnownPartnerAirlineBereichVerspaetet: ({ context }) =>
    context.fluggesellschaft !== "sonstiges" &&
    context.bereich === "verspaetet",
  isKnownPartnerAirlineBereichNichtBefoerderungOrAnnullierung: ({ context }) =>
    context.fluggesellschaft !== "sonstiges" &&
    (context.bereich === "nichtbefoerderung" ||
      context.bereich === "annullierung"),
  isFluggesellschaftNotInEU: ({ context }) => {
    const isAirlineInEU =
      airlines.find((airline) => airline.iata === context.fluggesellschaft)
        ?.isInEU ?? false;

    return !isAirlineInEU;
  },
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
  ...yesNoGuards("vertretbareGruende"),
  ...yesNoGuards("vertretbareGruendeAnnullierung"),
  ...yesNoGuards("ersatzflug"),
} satisfies Guards<FluggastrechtVorabcheckContext>;
