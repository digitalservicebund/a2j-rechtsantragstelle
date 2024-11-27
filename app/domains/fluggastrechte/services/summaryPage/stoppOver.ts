import type { Translations } from "~/services/translations/getTranslationByKey";
import { type FluggastrechtContext } from "../../formular/context";
import { getAirportNameByIataCode } from "../airports/getAirportNameByIataCode";

export type ZwischenstoppsProps = {
  readonly userData: FluggastrechtContext | undefined;
  readonly translations: Translations;
};

export const getZwischenStopps = (zwischenstopp: FluggastrechtContext) => {
  const ersterZwischenstoppName = getAirportNameByIataCode(
    zwischenstopp.ersterZwischenstopp ?? "",
  );
  const zweiterZwischenstoppName = getAirportNameByIataCode(
    zwischenstopp.zweiterZwischenstopp ?? "",
  );
  const dritterZwischenstoppName = getAirportNameByIataCode(
    zwischenstopp.dritterZwischenstopp ?? "",
  );
  const stopMapping = {
    noStop: undefined,
    oneStop: {
      ersterZwischenstopp: ersterZwischenstoppName ?? undefined,
    },
    twoStop: {
      ersterZwischenstopp: ersterZwischenstoppName ?? undefined,
      zweiterZwischenstopp: zweiterZwischenstoppName ?? undefined,
    },
    threeStop: {
      ersterZwischenstopp: ersterZwischenstoppName ?? undefined,
      zweiterZwischenstopp: zweiterZwischenstoppName ?? undefined,
      dritterZwischenstopp: dritterZwischenstoppName ?? undefined,
    },
  } as const;
  return stopMapping[
    zwischenstopp.zwischenstoppAnzahl as keyof typeof stopMapping
  ];
};

export const getAnzahlZwischenstopps = (userData: FluggastrechtContext) => {
  const stopps = {
    oneStop: 1,
    twoStop: 2,
    threeStop: 3,
  };
  return stopps[userData.zwischenstoppAnzahl as keyof typeof stopps];
};
