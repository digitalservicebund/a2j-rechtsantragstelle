import type { Config } from "~/services/flow/server/types";
import mapValues from "lodash/mapValues";
import { type NachlassErbausschlagungGerichtFindenUserData } from "~/domains/nachlass/erbausschlagung/gericht-finden/userData";
import { nachlassErbausschlagungGerichtFindenPages } from "~/domains/nachlass/erbausschlagung/gericht-finden/pages";
import { edgeCasesForPlz } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { ANGELEGENHEIT_INFO } from "~/services/gerichtsfinder/types";

const stepIds = mapValues(
  nachlassErbausschlagungGerichtFindenPages,
  (v) => v.stepId,
);

export const nachlassErbausschlagungGerichtFindenXstateConfig = {
  id: "/nachlass/erbausschlagung/gericht-finden",
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
            guard: ({ context }) => context.lebensmittelpunkt === "ausland",
            target: stepIds.plz,
          },
          stepIds.ausschlagungsOrt,
        ],
      },
    },
    [stepIds.ausschlagungsOrt]: {
      on: {
        BACK: stepIds.lebensmittelpunkt,
        SUBMIT: [
          {
            guard: ({ context }) => context.ausschlagungsOrt === "courtNearMe",
            target: stepIds.plz,
          },
          stepIds.pflegeheim,
        ],
      },
    },
    [stepIds.pflegeheim]: {
      on: {
        BACK: stepIds.ausschlagungsOrt,
        SUBMIT: "", // TODO: add pflegeheim/edge case logic and result page
      },
    },
    [stepIds.plz]: {
      on: {
        BACK: [
          {
            guard: ({ context }) => context.ausschlagungsOrt === "courtNearMe",
            target: stepIds.ausschlagungsOrt,
          },
          stepIds.lebensmittelpunkt,
        ],
        SUBMIT: [
          {
            guard: ({ context }) =>
              edgeCasesForPlz(context.plz, ANGELEGENHEIT_INFO.NACHLASSSACHEN)
                .length > 0,
            target: stepIds.strasseHausnummer,
          },
          stepIds.gerichtErmitteltWohnsitz,
        ],
      },
    },
    [stepIds.strasseHausnummer]: {
      on: {
        BACK: [stepIds.plz], // TODO: return to plz/pflegeheim/hospiz/lebensmittelpunkt
        SUBMIT: stepIds.gerichtErmitteltWohnsitz,
      },
    },
    [stepIds.gerichtErmitteltWohnsitz]: {
      on: {
        BACK: [
          {
            guard: ({ context }) =>
              edgeCasesForPlz(context.plz, ANGELEGENHEIT_INFO.NACHLASSSACHEN)
                .length > 0,
            target: stepIds.strasseHausnummer,
          },
          stepIds.plz,
        ],
      },
    },
  },
} satisfies Config<NachlassErbausschlagungGerichtFindenUserData>;
