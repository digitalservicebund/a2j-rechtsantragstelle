import airlines from "data/airlines/data.json";
import { calculateDistanceBetweenAirportsInKilometers } from "~/services/airports/calculateDistanceBetweenAirports";
import { isEuropeanUnionAirport } from "~/services/airports/isEuropeanUnionAirport";
import { isGermanAirport } from "~/services/airports/isGermanAirport";
import type { FluggastrechtVorabcheckContext } from "./context";
import { yesNoGuards, type Guards } from "../guards.server";

const isFluggesellschaftInEU = (fluggesellschaft?: string) => {
  const isAirlineInEU =
    airlines.find((airline) => airline.iata === fluggesellschaft)?.isInEU ??
    false;

  return isAirlineInEU;
};

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
  isNotEligibleFluggesellschaftInEU: ({
    context: { startAirport, fluggesellschaft },
  }) => {
    const isStartAirportEU = isEuropeanUnionAirport(startAirport);

    return !isStartAirportEU && !isFluggesellschaftInEU(fluggesellschaft);
  },
  /**
   * The functions isNotEligibleFluggesellschaftInEU and isNonGermanAirportsAndDestinationEUAndFluggesellschaftNotEU
   * go to the same page, but the logic are different, so keeping them in two different functions to test it properly
   * */
  isNonGermanAirportsAndDestinationEUAndFluggesellschaftNotEU: ({
    context: { startAirport, endAirport, fluggesellschaft },
  }) => {
    const isEndAirportEU = isEuropeanUnionAirport(endAirport);

    const isStartAirportGerman = isGermanAirport(startAirport);
    const isEndAirportGerman = isGermanAirport(endAirport);

    if (isStartAirportGerman || isEndAirportGerman) {
      return false;
    }

    return isEndAirportEU && !isFluggesellschaftInEU(fluggesellschaft);
  },
  isStartAirportNotEUAndFluggesellschaftSonstiges: ({
    context: { startAirport, fluggesellschaft },
  }) => {
    const isStartAirportEU = isEuropeanUnionAirport(startAirport);

    return !isStartAirportEU && fluggesellschaft === "sonstiges";
  },
  isNonGermanAirportsAndDestinationEUAndFluggesellschaftSonstiges: ({
    context: { startAirport, endAirport, fluggesellschaft },
  }) => {
    const isStartAirportGerman = isGermanAirport(startAirport);
    const isEndAirportGerman = isGermanAirport(endAirport);

    const isEndAirportEU = isEuropeanUnionAirport(endAirport);

    if (isStartAirportGerman || isEndAirportGerman) {
      return false;
    }

    return isEndAirportEU && fluggesellschaft === "sonstiges";
  },
  areAirportsOutsideEU: ({ context }) => {
    const isStartAirportEU = isEuropeanUnionAirport(context.startAirport);
    const isEndAirportEU = isEuropeanUnionAirport(context.endAirport);

    return !isStartAirportEU && !isEndAirportEU;
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
  isAnkuendigungBetween7And13DaysAndErsatzflugYes: ({ context }) => {
    return (
      context.ankuendigung === "between7And13Days" &&
      context.ersatzflug === "yes"
    );
  },
  isBereichAnnullierungAndVertretbareGruendeAnnullierungYes: ({ context }) => {
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
  isErsatzflugGelandet2StundenNoAndErsatzflugGestartet1StundeNo: ({
    context,
  }) => {
    return (
      context.ersatzflugLandenZweiStunden === "no" &&
      context.ersatzflugStartenEinStunde === "no"
    );
  },
  isErsatzflugGelandet4StundenNoAndErsatzflugGestartet2StundenNo: ({
    context,
  }) => {
    return (
      context.ersatzflugLandenVierStunden === "no" &&
      context.ersatzflugStartenZweiStunden === "no"
    );
  },
  isErfolgEU: ({
    context: { startAirport, endAirport, gericht, fluggesellschaft },
  }) => {
    // If the case is already in court, it's not an EU success
    if (gericht === "yes") {
      return false;
    }

    const isStartAirportGerman = isGermanAirport(startAirport);
    const isEndAirportGerman = isGermanAirport(endAirport);

    // Check if either start or end airport is German
    if (isStartAirportGerman || isEndAirportGerman) {
      return false;
    }

    const isStartAirportEU = isEuropeanUnionAirport(startAirport);
    const isEndAirportEU = isEuropeanUnionAirport(endAirport);

    // Check if both start and end airports are in the EU
    if (isStartAirportEU && isEndAirportEU) {
      return true;
    }

    // If the start airport is outside the EU, but the end airport is in the EU,
    // check if the airline is based in the EU
    if (!isStartAirportEU && isEndAirportEU) {
      return isFluggesellschaftInEU(fluggesellschaft);
    }

    return false;
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
