import type { Translations } from "~/services/translations/getTranslationByKey";
import { type FluggastrechtContext } from "../../formular/context";
import { getAirportNameByIataCode } from "../airports/getAirportNameByIataCode";

export type ZwischenstoppsProps = {
  readonly userData: FluggastrechtContext | undefined;
  readonly translations: Translations;
};

export const getZwischenStops = (zwischenstop: FluggastrechtContext) => {
  const ersterZwischenStoppName = getAirportNameByIataCode(
    zwischenstop.ersterZwischenstopp ?? "",
  );
  const zweiterZwischenstoppName = getAirportNameByIataCode(
    zwischenstop.zweiterZwischenstopp ?? "",
  );
  const dritterZwischenstoppName = getAirportNameByIataCode(
    zwischenstop.dritterZwischenstopp ?? "",
  );
  const stopMapping = {
    noStop: undefined,
    oneStop: {
      ersterZwischenStopp: ersterZwischenStoppName ?? undefined,
    },
    twoStop: {
      ersterZwischenStopp: ersterZwischenStoppName ?? undefined,
      zweiterZwischenstopp: zweiterZwischenstoppName ?? undefined,
    },
    threeStop: {
      ersterZwischenStopp: ersterZwischenStoppName ?? undefined,
      zweiterZwischenstopp: zweiterZwischenstoppName ?? undefined,
      dritterZwischenstopp: dritterZwischenstoppName ?? undefined,
    },
  } as const;
  return stopMapping[
    zwischenstop.zwischenstoppAnzahl as keyof typeof stopMapping
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
