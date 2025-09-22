import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { Config } from "~/services/flow/server/types";
import { GeldEinklagenFormularGerichtPruefenUserData } from "./userData";
import { geldEinklagenGerichtPruefenPages } from "./pages";

const steps = xStateTargetsFromPagesConfig(geldEinklagenGerichtPruefenPages);

export const gerichtPruefenXstateConfig = {
  id: "gericht-pruefen",
  initial: "intro",
  meta: { done: () => true },
  states: {
    intro: {
      id: "intro",
      initial: "intro",
      states: {
        [steps.introIntro.relative]: {
          on: {
            SUBMIT: steps.introStart.relative,
          },
        },
        [steps.introStart.relative]: {
          on: {
            SUBMIT: "#forderung.fragen",
            BACK: steps.introIntro.relative,
          },
        },
      },
    },
    forderung: {
      id: "forderung",
      initial: "fragen",
      states: {
        [steps.forderungFragen.relative]: {
          on: {
            SUBMIT: [
              {
                guard: ({ context }) => context.forderung === "etwasAnderes",
                target: "ergebnis/forderung-etwas-anderes",
              },
            ],
            BACK: "#intro.start",
          },
        },
        "ergebnis/forderung-etwas-anderes": {
          on: {
            BACK: "#forderung.fragen",
          },
        },
      },
    },
  },
} satisfies Config<GeldEinklagenFormularGerichtPruefenUserData>;
