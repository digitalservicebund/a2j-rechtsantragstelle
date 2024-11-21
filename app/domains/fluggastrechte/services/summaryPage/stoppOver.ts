import type { Context } from "~/domains/contexts";
import type { Translations } from "~/services/translations/getTranslationByKey";

export type ZwischenstoppsProps = {
  userData: Context | undefined;
  translations: Translations;
};

export const getZwischenStops = (zwischenstop: Context) => {
  const stopMapping = {
    noStop: undefined,
    oneStop: {
      ersterZwischenStopp: zwischenstop.ersterZwischenstopp ?? undefined,
    },
    twoStop: {
      ersterZwischenStopp: zwischenstop.ersterZwischenstopp ?? undefined,
      zweiterZwischenstopp: zwischenstop.zweiterZwischenstopp ?? undefined,
    },
    threeStop: {
      ersterZwischenStopp: zwischenstop.ersterZwischenstopp ?? undefined,
      zweiterZwischenstopp: zwischenstop.zweiterZwischenstopp ?? undefined,
      dritterZwischenstopp: zwischenstop.dritterZwischenstopp ?? undefined,
    },
  } as const;
  return stopMapping[
    zwischenstop.zwischenstoppAnzahl as keyof typeof stopMapping
  ];
};

export const getAnzahlZwischenstopps = (userData: Context) => {
  const stopps = {
    oneStop: 1,
    twoStop: 2,
    threeStop: 3,
  };
  return stopps[userData.zwischenstoppAnzahl as keyof typeof stopps];
};
