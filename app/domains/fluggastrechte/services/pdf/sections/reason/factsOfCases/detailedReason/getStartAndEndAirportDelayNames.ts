import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { getAirportNameByIataCode } from "~/domains/fluggastrechte/services/airports/getAirportNameByIataCode";

type AirportPair = [string | undefined, string | undefined];

const getPairFrom = (
  key: string | undefined,
  mapping: Record<string, AirportPair>,
): AirportPair | undefined => {
  if (!key) return undefined;
  const pair = mapping[key] as AirportPair | undefined;
  return pair;
};

export const getStartAndEndAirportDelayNames = ({
  verspaeteterFlugOneStop,
  verspaeteterFlugTwoStops,
  verspaeteterFlugThreeStop,
  startAirport,
  endAirport,
  ersterZwischenstopp,
  zweiterZwischenstopp,
  dritterZwischenstopp,
}: FluggastrechteUserData) => {
  const oneStop = {
    startAirportFirstZwischenstopp: [
      startAirport,
      ersterZwischenstopp,
    ] as AirportPair,
    firstZwischenstoppEndAirport: [
      ersterZwischenstopp,
      endAirport,
    ] as AirportPair,
  } as const;

  const twoStop = {
    startAirportFirstZwischenstopp: [
      startAirport,
      ersterZwischenstopp,
    ] as AirportPair,
    firstAirportSecondZwischenstopp: [
      ersterZwischenstopp,
      zweiterZwischenstopp,
    ] as AirportPair,
    secondZwischenstoppEndAirport: [
      zweiterZwischenstopp,
      endAirport,
    ] as AirportPair,
  } as const;

  const threeStop = {
    startAirportFirstZwischenstopp: [
      startAirport,
      ersterZwischenstopp,
    ] as AirportPair,
    firstAirportSecondZwischenstopp: [
      ersterZwischenstopp,
      zweiterZwischenstopp,
    ] as AirportPair,
    secondAirportThirdZwischenstopp: [
      zweiterZwischenstopp,
      dritterZwischenstopp,
    ] as AirportPair,
    thirdZwischenstoppEndAirport: [
      dritterZwischenstopp,
      endAirport,
    ] as AirportPair,
  } as const;

  const pair =
    getPairFrom(verspaeteterFlugOneStop, oneStop) ??
    getPairFrom(verspaeteterFlugTwoStops, twoStop) ??
    getPairFrom(verspaeteterFlugThreeStop, threeStop);

  if (!pair) return { startAirportName: "", endAirportName: "" };

  const [startCode, endCode] = pair;

  const startName = startCode
    ? (getAirportNameByIataCode(startCode) ?? "")
    : "";
  const endName = endCode ? (getAirportNameByIataCode(endCode) ?? "") : "";

  return { startAirportName: startName, endAirportName: endName };
};
