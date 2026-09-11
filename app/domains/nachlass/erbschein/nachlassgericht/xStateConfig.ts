import mapValues from "lodash/mapValues";
import { erbscheinNachlassgerichtPages } from "./pages";
import type { Config } from "~/services/flow/server/types";
import type { ErbscheinNachlassGerichtUserData } from "./userData";
import { edgeCasesForPlz } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { ANGELEGENHEIT_INFO } from "~/services/gerichtsfinder/types";

const stepIds = mapValues(erbscheinNachlassgerichtPages, (v) => v.stepId);

export const erbscheinNachlassgerichtXstateConfig = {
  id: "/erbschein/nachlassgericht",
  initial: stepIds.start,
  states: {
    [stepIds.start]: {
      on: { SUBMIT: stepIds.lebensmittelpunkt },
    },
    [stepIds.lebensmittelpunkt]: {
      on: {
        BACK: stepIds.start,
        SUBMIT: [
          {
            guard: ({ context }) => context.lebensmittelpunkt === "deutschland",
            target: stepIds.wohnsituationPflegeheim,
          },
          stepIds.auslaendischerErbfall,
        ],
      },
    },
    [stepIds.auslaendischerErbfall]: {
      on: {
        BACK: stepIds.lebensmittelpunkt,
      },
    },
    [stepIds.wohnsituationPflegeheim]: {
      on: {
        BACK: stepIds.lebensmittelpunkt,
        SUBMIT: [
          {
            guard: ({ context }) => context.wohnsituationPflegeheim === "yes",
            target: stepIds.plzPflegeheim,
          },
          stepIds.wohnsituationHospiz,
        ],
      },
    },
    [stepIds.plzPflegeheim]: {
      on: {
        BACK: stepIds.wohnsituationPflegeheim,
        SUBMIT: [
          {
            guard: ({ context }) =>
              edgeCasesForPlz(
                context.plzPflegeheim,
                ANGELEGENHEIT_INFO.NACHLASSSACHEN,
              ).length === 0,
            target: stepIds.nachlassgerichtErgebnis,
          },
          stepIds.strasseHausnummer,
        ],
      },
    },
    [stepIds.wohnsituationHospiz]: {
      on: {
        BACK: stepIds.wohnsituationPflegeheim,
        SUBMIT: [
          {
            guard: ({ context }) => context.wohnsituationHospiz === "yes",
            target: stepIds.plzHospiz,
          },
          stepIds.plzLebensmittelpunkt,
        ],
      },
    },
    [stepIds.plzHospiz]: {
      on: {
        BACK: stepIds.wohnsituationHospiz,
        SUBMIT: [
          {
            guard: ({ context }) =>
              edgeCasesForPlz(
                context.plzHospiz,
                ANGELEGENHEIT_INFO.NACHLASSSACHEN,
              ).length === 0,
            target: stepIds.nachlassgerichtErgebnis,
          },
          stepIds.strasseHausnummer,
        ],
      },
    },
    [stepIds.plzLebensmittelpunkt]: {
      on: {
        BACK: stepIds.wohnsituationHospiz,
        SUBMIT: [
          {
            guard: ({ context }) =>
              edgeCasesForPlz(
                context.plzLebensmittelpunkt,
                ANGELEGENHEIT_INFO.NACHLASSSACHEN,
              ).length === 0,
            target: stepIds.nachlassgerichtErgebnis,
          },
          stepIds.strasseHausnummer,
        ],
      },
    },
    [stepIds.strasseHausnummer]: {
      on: {
        BACK: [
          {
            guard: ({ context }) =>
              context.wohnsituationHospiz === "no" &&
              context.wohnsituationPflegeheim === "no",
            target: stepIds.plzLebensmittelpunkt,
          },
          {
            guard: ({ context }) => context.wohnsituationHospiz === "yes",
            target: stepIds.plzHospiz,
          },
          stepIds.plzPflegeheim,
        ],
        SUBMIT: stepIds.nachlassgerichtErgebnis,
      },
    },
    [stepIds.nachlassgerichtErgebnis]: {
      on: {
        BACK: [
          {
            guard: ({ context }) =>
              edgeCasesForPlz(
                context.plzLebensmittelpunkt ??
                  context.plzHospiz ??
                  context.plzPflegeheim ??
                  ANGELEGENHEIT_INFO.NACHLASSSACHEN,
              ).length > 0,
            target: stepIds.strasseHausnummer,
          },
          {
            guard: ({ context }) =>
              context.wohnsituationHospiz === "no" &&
              context.wohnsituationPflegeheim === "no",
            target: stepIds.plzLebensmittelpunkt,
          },
          {
            guard: ({ context }) => context.wohnsituationHospiz === "yes",
            target: stepIds.plzHospiz,
          },
          stepIds.plzPflegeheim,
        ],
      },
    },
  },
} satisfies Config<ErbscheinNachlassGerichtUserData>;
