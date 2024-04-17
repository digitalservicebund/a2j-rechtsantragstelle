import { calculateDistanceBetweenAirportsInKilometers } from "~/util/calculateDistanceBetweenAirports";
import { EUCountries, partnerCourtAirports } from ".";
import { yesNoGuards, type Guards } from "../guards.server";
import type { FluggastrechtVorabcheckContext } from "./context";
import airports from "data/airports/data.json";

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
    return distance < 0;
  },
  isAirportOutsideEU: ({ context }) => {
    const countryStartAirport = airports.find(
      (aiport) => aiport.iata === context.startAirport,
    )?.country_code;
    const countryeEndAirport = airports.find(
      (aiport) => aiport.iata === context.endAirport,
    )?.country_code;

    if (
      typeof countryStartAirport === "undefined" ||
      typeof countryeEndAirport === "undefined"
    ) {
      return true;
    }

    return (
      !EUCountries.includes(countryStartAirport) &&
      !EUCountries.includes(countryeEndAirport)
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
} satisfies Guards<FluggastrechtVorabcheckContext>;
