import { mapValues } from "lodash";
import { erbscheinNachlassgerichtPages } from "./pages";
import type { Config } from "~/services/flow/server/types";
import type { ErbscheinNachlassGerichtUserData } from "./userData";

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
        SUBMIT: stepIds.wohnsituation,
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
        SUBMIT: stepIds.strasseHausnummer,
      },
    },
    [stepIds.plzPflegeheim]: {
      on: {
        BACK: stepIds.wohnsituation,
        SUBMIT: stepIds.strasseHausnummer,
      },
    },
    [stepIds.plzHospiz]: {
      on: {
        BACK: stepIds.wohnsituation,
        SUBMIT: stepIds.strasseHausnummer,
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
      },
    },
  },
} satisfies Config<ErbscheinNachlassGerichtUserData>;
