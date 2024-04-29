import { calculateDistanceBetweenAirportsInKilometers } from "~/util/calculateDistanceBetweenAirports";
import { EUCountries, partnerCourtAirports } from ".";
import { yesNoGuards, type Guards } from "../guards.server";
import type { FluggastrechtVorabcheckContext } from "./context";
import airports from "data/airports/data.json";

function getCountryCodeByIata(airportIata: string | undefined) {
  return airports.find((airport) => airport.iata === airportIata)?.country_code;
}

export const guards = {
  bereichVerspaetet: ({ context }) => context.bereich === "verspaetet",
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
  fluggesellschaftFilled: ({ context }) =>
    Boolean(context.startAirport && context.endAirport),
  isKnownPartnerAirline: ({ context }) =>
    context.fluggesellschaft !== "sonstiges",
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
} satisfies Guards<FluggastrechtVorabcheckContext>;
