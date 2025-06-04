import type { FluggastrechtVorabcheckUserData } from "./userData";
import { yesNoGuards, type Guards } from "../../guards.server";
import { isErfolgAnalog } from "./services/isErfolgAnalog";
import { isFluggesellschaftInEU } from "./services/isFluggesellschaftInEU";
import { calculateDistanceBetweenAirportsInKilometers } from "../services/airports/calculateDistanceBetweenAirports";
import { isEuropeanUnionAirport } from "../services/airports/isEuropeanUnionAirport";
import { isGermanAirport } from "../services/airports/isGermanAirport";

export const guards = {
  isInvalidAirportDistance: ({ context }) => {
    const distance = calculateDistanceBetweenAirportsInKilometers(
      context.startAirport ?? "",
      context.endAirport ?? "",
    );
    return distance.isErr;
  },
  isGermanEndAirportsAndIsNotClaimable: ({
    context: { startAirport, endAirport, fluggesellschaft },
  }) => {
    const isEndAirportGerman = isGermanAirport(endAirport);
    const isStartAirportGerman = isGermanAirport(startAirport);
    const isStartAirportEU = isEuropeanUnionAirport(startAirport);

    return (
      isEndAirportGerman &&
      !isStartAirportGerman &&
      !isStartAirportEU &&
      !isFluggesellschaftInEU(fluggesellschaft)
    );
  },
  /**
   * The functions isGermanEndAirportsAndIsNotClaimable and isNonGermanAirportsAndIsNotClaimableInEU
   * go to the same page, but the logic are different, so keeping them in two different functions to test it properly
   * */
  isNonGermanAirportsAndIsNotClaimableInEU: ({
    context: { startAirport, endAirport, fluggesellschaft },
  }) => {
    const isStartAirportGerman = isGermanAirport(startAirport);
    const isEndAirportGerman = isGermanAirport(endAirport);

    const isStartAirportEU = isEuropeanUnionAirport(startAirport);
    const isEndAirportEU = isEuropeanUnionAirport(endAirport);

    if (isStartAirportGerman || isEndAirportGerman) {
      return false;
    }

    if (isStartAirportEU) {
      return false;
    }

    return isEndAirportEU && !isFluggesellschaftInEU(fluggesellschaft);
  },
  isGermanEndAirportsAndOtherAirline: ({
    context: { startAirport, endAirport, fluggesellschaft },
  }) => {
    const isStartAirportGerman = isGermanAirport(startAirport);
    const isEndAirportGerman = isGermanAirport(endAirport);
    const isStartAirportEU = isEuropeanUnionAirport(startAirport);

    return (
      isEndAirportGerman &&
      !isStartAirportGerman &&
      !isStartAirportEU &&
      fluggesellschaft === "sonstiges"
    );
  },
  isNonGermanAirportsAndIsNotClaimableInEUWithOtherAirline: ({
    context: { startAirport, endAirport, fluggesellschaft },
  }) => {
    const isStartAirportGerman = isGermanAirport(startAirport);
    const isEndAirportGerman = isGermanAirport(endAirport);

    const isStartAirportEU = isEuropeanUnionAirport(startAirport);
    const isEndAirportEU = isEuropeanUnionAirport(endAirport);

    if (isStartAirportGerman || isEndAirportGerman) {
      return false;
    }

    if (isStartAirportEU) {
      return false;
    }

    return isEndAirportEU && fluggesellschaft === "sonstiges";
  },
  areAirportsOutsideEU: ({ context }) => {
    const isStartAirportEU = isEuropeanUnionAirport(context.startAirport);
    const isEndAirportEU = isEuropeanUnionAirport(context.endAirport);

    return !isStartAirportEU && !isEndAirportEU;
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

    // Check if the start airport is in the EU
    if (isStartAirportEU) {
      return true;
    }

    // If the start airport is outside the EU, but the end airport is in the EU,
    // check if the airline is based in the EU

    return (
      !isStartAirportEU &&
      isEndAirportEU &&
      isFluggesellschaftInEU(fluggesellschaft)
    );
  },

  isErfolgAnalogGuard: ({ context }) => {
    return isErfolgAnalog(context);
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
} satisfies Guards<FluggastrechtVorabcheckUserData>;
