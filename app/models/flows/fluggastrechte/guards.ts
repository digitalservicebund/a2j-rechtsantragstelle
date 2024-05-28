import { calculateDistanceBetweenAirportsInKilometers } from "~/util/calculateDistanceBetweenAirports";
import { EUCountries, partnerCourtAirports } from ".";
import { yesNoGuards, type Guards } from "../guards.server";
import type { FluggastrechtVorabcheckContext } from "./context";
import airports from "data/airports/data.json";

function getCountryCodeByIata(airportIata: string | undefined) {
  return airports.find((airport) => airport.iata === airportIata)?.country_code;
}

function isEUInboundFromNonEUAndOutboundEU(
  context: FluggastrechtVorabcheckContext,
) {
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
    return isEUInboundFromNonEUAndOutboundEU(context);
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
  isCheckingBereichNichtBefoerderungCompensationYes: ({ context }) => {
    if (context.bereich !== "nichtbefoerderung") {
      return false;
    }

    return context?.compensation === "yes";
  },
  isCheckingBereichNichtBefoerderungCompensationNo: ({ context }) => {
    if (context.bereich !== "nichtbefoerderung") {
      return false;
    }

    return context?.compensation === "no";
  },
  isCheckingYesBereichVerspaetet: ({ context }) => {
    return context?.bereich === "verspaetet" && context?.checkin === "yes";
  },
  isCheckingYesBereichNichtBefoerderung: ({ context }) => {
    return (
      context?.bereich === "nichtbefoerderung" && context?.checkin === "yes"
    );
  },
  isJustifiableReasonsIncludeNoBereichNichtBefoerderung: ({ context }) => {
    return (
      context?.bereich === "nichtbefoerderung" &&
      context?.justifiableReasonsInclude === "no"
    );
  },
  isEUInboundFromNonEUBereichNichtBefoerderung: ({ context }) => {
    return (
      isEUInboundFromNonEUAndOutboundEU(context) &&
      context?.bereich === "nichtbefoerderung"
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
  ...yesNoGuards("compensation"),
  ...yesNoGuards("compensationAccepted"),
  ...yesNoGuards("justifiableReasonsInclude"),
} satisfies Guards<FluggastrechtVorabcheckContext>;
