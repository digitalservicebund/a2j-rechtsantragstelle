import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { getAirportNameByIataCode } from "~/domains/fluggastrechte/services/airports/getAirportNameByIataCode";

export const getStartAndEndAirportDelayNames = ({
  verspaeteterFlug,
  startAirport,
  endAirport,
  ersterZwischenstopp,
  zweiterZwischenstopp,
  dritterZwischenstopp,
}: FluggastrechtContext) => {
  if (typeof verspaeteterFlug === "undefined") {
    return {
      startAirportName: "",
      endAirportName: "",
    };
  }

  const airportMapping: Record<
    Exclude<FluggastrechtContext["verspaeteterFlug"], undefined>,
    [string | undefined, string | undefined]
  > = {
    startAirportFirstZwischenstopp: [startAirport, ersterZwischenstopp],
    firstAirportSecondZwischenstopp: [
      ersterZwischenstopp,
      zweiterZwischenstopp,
    ],
    firstZwischenstoppEndAirport: [ersterZwischenstopp, endAirport],
    secondAirportThirdZwischenstopp: [
      zweiterZwischenstopp,
      dritterZwischenstopp,
    ],
    secondZwischenstoppEndAirport: [zweiterZwischenstopp, endAirport],
    thirdZwischenstoppEndAirport: [dritterZwischenstopp, endAirport],
  };

  const [start, end] = airportMapping[verspaeteterFlug];

  return {
    startAirportName: getAirportNameByIataCode(start ?? ""),
    endAirportName: getAirportNameByIataCode(end ?? ""),
  };
};
