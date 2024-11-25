import type { Translations } from "~/services/translations/getTranslationByKey";
import { FluggastrechtContext } from "../../formular/context";
import { getAirportByIataCode } from "../airports/getAirportByIataCode";

export type ZwischenstoppsProps = {
  userData: FluggastrechtContext | undefined;
  translations: Translations;
};

export const getZwischenStops = (zwischenstop: FluggastrechtContext) => {
  const ersterZwischenStoppName = getAirportByIataCode(
    zwischenstop.ersterZwischenstopp,
  )?.airport;
  const zweiterZwischenstoppName = getAirportByIataCode(
      zwischenstop.zweiterZwischenstopp,
    )?.airport,
    dritterZwischenstoppName = getAirportByIataCode(
      zwischenstop.dritterZwischenstopp,
    )?.airport;
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
