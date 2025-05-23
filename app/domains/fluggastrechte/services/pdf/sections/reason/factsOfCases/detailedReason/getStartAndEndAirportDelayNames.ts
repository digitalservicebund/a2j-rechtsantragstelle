import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { getAirportNameByIataCode } from "~/domains/fluggastrechte/services/airports/getAirportNameByIataCode";

export const getStartAndEndAirportDelayNames = ({
  verspaeteterFlug,
  startAirport,
  endAirport,
  ersterZwischenstopp,
  zweiterZwischenstopp,
  dritterZwischenstopp,
}: FluggastrechteUserData) => {
  if (typeof verspaeteterFlug === "undefined") {
    return {
      startAirportName: "",
      endAirportName: "",
    };
  }

  const airportMapping: Record<
    Exclude<FluggastrechteUserData["verspaeteterFlug"], undefined>,
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
