import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { type Config } from "~/services/flow/server/types";
import { geldEinklagenGerichtPruefenPages } from "../pages";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "../userData";
import { introDone } from "../doneFunctions";

const steps = xStateTargetsFromPagesConfig(geldEinklagenGerichtPruefenPages);

export const introXstateConfig = {
  id: "intro",
  initial: "anwaltschaft",
  states: {
    [steps.introAnwaltschaft.relative]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.anwaltschaft === "yes",
            target: steps.introVoraussetzungenAnwaltschaft.relative,
          },
          steps.introVoraussetzungen.relative,
        ],
      },
    },
    [steps.introVoraussetzungenAnwaltschaft.relative]: {
      on: {
        SUBMIT: steps.introStart.relative,
        BACK: steps.introAnwaltschaft.relative,
      },
    },
    [steps.introVoraussetzungen.relative]: {
      on: {
        SUBMIT: steps.introStart.relative,
        BACK: steps.introAnwaltschaft.relative,
      },
    },
    [steps.introStart.relative]: {
      on: {
        SUBMIT: { guard: introDone, target: steps.forderungWas.absolute },
        BACK: [
          {
            guard: ({ context }) => context.anwaltschaft === "yes",
            target: steps.introVoraussetzungenAnwaltschaft.absolute,
          },
          steps.introVoraussetzungen.absolute,
        ],
      },
    },
  },
} satisfies Config<GeldEinklagenFormularGerichtPruefenUserData>;
