import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import type { Config } from "~/services/flow/server/buildFlowController";
import { grundvoraussetzungDone } from "./grundvoraussetzungDone";
import { berHAntragGrundvoraussetzungenPages } from "./pages";
import type { BeratungshilfeGrundvoraussetzungenUserData } from "./userData";

const steps = xStateTargetsFromPagesConfig(berHAntragGrundvoraussetzungenPages);

export const grundvorraussetzungXstateConfig = {
  initial: "start",
  id: "grundvoraussetzungen",
  meta: { done: grundvoraussetzungDone },
  states: {
    start: {
      on: {
        SUBMIT: steps.rechtsschutzversicherung.relative,
        BACK: "#antragStart",
      },
    },
    [steps.rechtsschutzversicherung.relative]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.rechtsschutzversicherung === "no",
            target: steps.wurdeVerklagt.relative,
          },
          {
            target: steps.rechtsschutzversicherungHinweis.relative,
          },
        ],
        BACK: "start",
      },
    },
    [steps.rechtsschutzversicherungHinweis.relative]: {
      on: {
        BACK: steps.rechtsschutzversicherung.relative,
      },
    },
    [steps.wurdeVerklagt.relative]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.wurdeVerklagt === "no",
            target: steps.klageEingereicht.relative,
          },
          {
            target: steps.wurdeVerklagtHinweis.relative,
          },
        ],
        BACK: steps.rechtsschutzversicherung.relative,
      },
    },
    [steps.wurdeVerklagtHinweis.relative]: {
      on: {
        BACK: steps.wurdeVerklagt.relative,
      },
    },
    [steps.klageEingereicht.relative]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.klageEingereicht === "no",
            target: steps.hamburgOderBremen.relative,
          },
          {
            target: steps.klageEingereichtHinweis.relative,
          },
        ],
        BACK: steps.wurdeVerklagt.relative,
      },
    },
    [steps.hamburgOderBremen.relative]: {
      on: {
        SUBMIT: [
          {
            target: steps.hamburgOderBremenHinweis.relative,
            guard: ({ context }) => context.hamburgOderBremen === "yes",
          },
          steps.beratungshilfeBeantragt.relative,
        ],
        BACK: steps.klageEingereicht.relative,
      },
    },
    [steps.hamburgOderBremenHinweis.relative]: {
      on: {
        BACK: steps.hamburgOderBremen.relative,
      },
    },
    [steps.klageEingereichtHinweis.relative]: {
      on: {
        BACK: steps.klageEingereicht.relative,
      },
    },
    [steps.beratungshilfeBeantragt.relative]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.beratungshilfeBeantragt === "no",
            target: steps.eigeninitiativeGrundvorraussetzung.relative,
          },
          {
            target: steps.beratungshilfeBeantragtHinweis.relative,
          },
        ],
        BACK: steps.hamburgOderBremen.relative,
      },
    },
    [steps.beratungshilfeBeantragtHinweis.relative]: {
      on: {
        BACK: steps.beratungshilfeBeantragt.relative,
      },
    },
    [steps.eigeninitiativeGrundvorraussetzung.relative]: {
      on: {
        SUBMIT: [
          {
            target: "#anwaltliche-vertretung.start",
            guard: grundvoraussetzungDone,
          },
          {
            target: steps.eigeninitiativeGrundvorraussetzungHinweis.relative,
          },
        ],
        BACK: steps.beratungshilfeBeantragt.relative,
      },
    },
    [steps.eigeninitiativeGrundvorraussetzungHinweis.relative]: {
      on: {
        BACK: steps.eigeninitiativeGrundvorraussetzung.relative,
      },
    },
  },
} satisfies Config<BeratungshilfeGrundvoraussetzungenUserData>;
