import mapValues from "lodash/mapValues";
import type { Config } from "~/services/flow/server/buildFlowController";
import { grundvoraussetzungDone } from "./grundvoraussetzungDone";
import type { BeratungshilfeGrundvoraussetzungenUserData } from "./userData";
import { beratungshilfeAntragPages } from "../pages";

const stepIds = mapValues(beratungshilfeAntragPages, (v) => v.stepId);

export const grundvorraussetzungXstateConfig = {
  initial: stepIds.start,
  id: stepIds.grundvoraussetzungen,
  meta: { done: grundvoraussetzungDone },
  states: {
    start: {
      on: {
        SUBMIT: stepIds.rechtsschutzversicherung,
        BACK: "#antragStart",
      },
    },
    [stepIds.rechtsschutzversicherung]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.rechtsschutzversicherung === "no",
            target: stepIds.wurdeVerklagt,
          },
          {
            target: stepIds.rechtsschutzversicherungHinweis,
          },
        ],
        BACK: stepIds.start,
      },
    },
    [stepIds.rechtsschutzversicherungHinweis]: {
      on: {
        BACK: stepIds.rechtsschutzversicherung,
      },
    },
    [stepIds.wurdeVerklagt]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.wurdeVerklagt === "no",
            target: stepIds.klageEingereicht,
          },
          {
            target: stepIds.wurdeVerklagtHinweis,
          },
        ],
        BACK: stepIds.rechtsschutzversicherung,
      },
    },
    [stepIds.wurdeVerklagtHinweis]: {
      on: {
        BACK: stepIds.wurdeVerklagt,
      },
    },
    [stepIds.klageEingereicht]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.klageEingereicht === "no",
            target: stepIds.hamburgOderBremen,
          },
          {
            target: stepIds.klageEingereichtHinweis,
          },
        ],
        BACK: stepIds.wurdeVerklagt,
      },
    },
    [stepIds.hamburgOderBremen]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.hamburgOderBremenHinweis,
            guard: ({ context }) => context.hamburgOderBremen === "yes",
          },
          stepIds.beratungshilfeBeantragt,
        ],
        BACK: stepIds.klageEingereicht,
      },
    },
    [stepIds.hamburgOderBremenHinweis]: {
      on: {
        BACK: stepIds.hamburgOderBremen,
      },
    },
    [stepIds.klageEingereichtHinweis]: {
      on: {
        BACK: stepIds.klageEingereicht,
      },
    },
    [stepIds.beratungshilfeBeantragt]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.beratungshilfeBeantragt === "no",
            target: stepIds.eigeninitiativeGrundvorraussetzung,
          },
          {
            target: stepIds.beratungshilfeBeantragtHinweis,
          },
        ],
        BACK: stepIds.hamburgOderBremen,
      },
    },
    [stepIds.beratungshilfeBeantragtHinweis]: {
      on: {
        BACK: stepIds.beratungshilfeBeantragt,
      },
    },
    [stepIds.eigeninitiativeGrundvorraussetzung]: {
      on: {
        SUBMIT: [
          {
            target: stepIds.anwaltlicheVertretungStart,
            guard: grundvoraussetzungDone,
          },
          {
            target: stepIds.eigeninitiativeGrundvorraussetzungHinweis,
          },
        ],
        BACK: stepIds.beratungshilfeBeantragt,
      },
    },
    [stepIds.eigeninitiativeGrundvorraussetzungHinweis]: {
      on: {
        BACK: stepIds.eigeninitiativeGrundvorraussetzung,
      },
    },
  },
} satisfies Config<BeratungshilfeGrundvoraussetzungenUserData>;
