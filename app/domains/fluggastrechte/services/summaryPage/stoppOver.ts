import { type StepOverAirports } from "../../components/useStepOverAirports";
import { type FluggastrechtContext } from "../../formular/context";

export const getZwischenStopps = (
  zwischenstopp: FluggastrechtContext,
  {
    ersterZwischenstoppName,
    zweiterZwischenstoppName,
    dritterZwischenstoppName,
  }: StepOverAirports,
) => {
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
