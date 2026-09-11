import type { Config } from "~/services/flow/server/types";
import mapValues from "lodash/mapValues";
import { type ErbausschlagungGerichtFindenUserData } from "~/domains/nachlass/erbausschlagung/gericht-finden/userData";
import { erbausschlagungGerichtFindenPages } from "~/domains/nachlass/erbausschlagung/gericht-finden/pages";
import { edgeCasesForPlz } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { ANGELEGENHEIT_INFO } from "~/services/gerichtsfinder/types";

const stepIds = mapValues(erbausschlagungGerichtFindenPages, (v) => v.stepId);

export const erbausschlagungGerichtFindenXstateConfig = {
  id: "/erbausschlagung/gericht-finden",
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
        SUBMIT: [
          {
            guard: ({ context }) => context.pflegeheim === "yes",
            target: stepIds.plzPflegeheim,
          },
          stepIds.hospiz,
        ],
      },
    },
    [stepIds.plzPflegeheim]: {
      on: {
        BACK: stepIds.pflegeheim,
        SUBMIT: [
          {
            guard: ({ context }) =>
              edgeCasesForPlz(
                context.plzPflegeheim,
                ANGELEGENHEIT_INFO.NACHLASSSACHEN,
              ).length > 0,
            target: stepIds.strasseHausnummer,
          },
          stepIds.gerichtErmitteltWohnsitz,
        ],
      },
    },
    [stepIds.hospiz]: {
      on: {
        BACK: stepIds.pflegeheim,
        SUBMIT: [
          {
            guard: ({ context }) => context.hospiz === "yes",
            target: stepIds.plzHospiz,
          },
          stepIds.plzLebensmittelpunkt,
        ],
      },
    },
    [stepIds.plzHospiz]: {
      on: {
        BACK: stepIds.hospiz,
        SUBMIT: [
          {
            guard: ({ context }) =>
              edgeCasesForPlz(
                context.plzHospiz,
                ANGELEGENHEIT_INFO.NACHLASSSACHEN,
              ).length > 0,
            target: stepIds.strasseHausnummer,
          },
          stepIds.gerichtErmitteltWohnsitz,
        ],
      },
    },
    [stepIds.plzLebensmittelpunkt]: {
      on: {
        BACK: stepIds.hospiz,
        SUBMIT: [
          {
            guard: ({ context }) =>
              edgeCasesForPlz(
                context.plzLebensmittelpunkt,
                ANGELEGENHEIT_INFO.NACHLASSSACHEN,
              ).length > 0,
            target: stepIds.strasseHausnummer,
          },
          stepIds.gerichtErmitteltWohnsitz,
        ],
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
        BACK: [
          {
            guard: ({ context }) => context.pflegeheim === "yes",
            target: stepIds.plzPflegeheim,
          },
          {
            guard: ({ context }) => context.hospiz === "yes",
            target: stepIds.plzHospiz,
          },
          {
            guard: ({ context }) =>
              context.lebensmittelpunkt === "deutschland" &&
              context.ausschlagungsOrt === "courtNearDeceased",
            target: stepIds.plzLebensmittelpunkt,
          },
          stepIds.plz,
        ],
        SUBMIT: stepIds.gerichtErmitteltWohnsitz,
      },
    },
    [stepIds.gerichtErmitteltWohnsitz]: {
      on: {
        BACK: [
          {
            guard: ({ context }) =>
              context.pflegeheim === "yes" &&
              edgeCasesForPlz(
                context.plzPflegeheim,
                ANGELEGENHEIT_INFO.NACHLASSSACHEN,
              ).length > 0,
            target: stepIds.strasseHausnummer,
          },
          {
            guard: ({ context }) => context.pflegeheim === "yes",
            target: stepIds.plzPflegeheim,
          },
          {
            guard: ({ context }) =>
              context.hospiz === "yes" &&
              edgeCasesForPlz(
                context.plzHospiz,
                ANGELEGENHEIT_INFO.NACHLASSSACHEN,
              ).length > 0,
            target: stepIds.strasseHausnummer,
          },
          {
            guard: ({ context }) => context.hospiz === "yes",
            target: stepIds.plzHospiz,
          },
          {
            guard: ({ context }) =>
              context.lebensmittelpunkt === "deutschland" &&
              context.ausschlagungsOrt === "courtNearDeceased" &&
              edgeCasesForPlz(
                context.plzLebensmittelpunkt,
                ANGELEGENHEIT_INFO.NACHLASSSACHEN,
              ).length > 0,
            target: stepIds.strasseHausnummer,
          },
          {
            guard: ({ context }) =>
              context.lebensmittelpunkt === "deutschland" &&
              context.ausschlagungsOrt === "courtNearDeceased",
            target: stepIds.plzLebensmittelpunkt,
          },
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
} satisfies Config<ErbausschlagungGerichtFindenUserData>;
