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
            target: stepIds.wohnsituation,
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
    [stepIds.wohnsituation]: {
      on: {
        BACK: stepIds.lebensmittelpunkt,
        SUBMIT: [
          {
            guard: ({ context }) => context.wohnsituation === "wohnungOderHaus",
            target: stepIds.plzWohnungOderHaus,
          },
          {
            guard: ({ context }) => context.wohnsituation === "pflegeheim",
            target: stepIds.plzPflegeheim,
          },
          stepIds.plzHospiz,
        ],
      },
    },
    [stepIds.plzWohnungOderHaus]: {
      on: {
        BACK: stepIds.wohnsituation,
        SUBMIT: [
          {
            guard: ({ context }) =>
              edgeCasesForPlz(
                context.plzWohnungOderHaus,
                ANGELEGENHEIT_INFO.NACHLASSSACHEN,
              ).length === 0,
            target: stepIds.nachlassgerichtErgebnis,
          },
          stepIds.strasseHausnummer,
        ],
      },
    },
    [stepIds.plzPflegeheim]: {
      on: {
        BACK: stepIds.wohnsituation,
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
    [stepIds.plzHospiz]: {
      on: {
        BACK: stepIds.wohnsituation,
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
    [stepIds.strasseHausnummer]: {
      on: {
        BACK: [
          {
            guard: ({ context }) => context.wohnsituation === "wohnungOderHaus",
            target: stepIds.plzWohnungOderHaus,
          },
          {
            guard: ({ context }) => context.wohnsituation === "pflegeheim",
            target: stepIds.plzPflegeheim,
          },
          stepIds.plzHospiz,
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
                context.plzWohnungOderHaus ??
                  context.plzPflegeheim ??
                  context.plzHospiz,
                ANGELEGENHEIT_INFO.NACHLASSSACHEN,
              ).length > 0,
            target: stepIds.strasseHausnummer,
          },
          {
            guard: ({ context }) => context.wohnsituation === "wohnungOderHaus",
            target: stepIds.plzWohnungOderHaus,
          },
          {
            guard: ({ context }) => context.wohnsituation === "pflegeheim",
            target: stepIds.plzPflegeheim,
          },
          stepIds.plzHospiz,
        ],
      },
    },
  },
} satisfies Config<ErbscheinNachlassGerichtUserData>;
