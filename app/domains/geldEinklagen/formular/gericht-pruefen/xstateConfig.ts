import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { type Config } from "~/services/flow/server/types";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "./userData";
import { geldEinklagenGerichtPruefenPages } from "./pages";
import { forderungDone } from "./doneFunctions";

const steps = xStateTargetsFromPagesConfig(geldEinklagenGerichtPruefenPages);

export const gerichtPruefenXstateConfig = {
  id: "gericht-pruefen",
  initial: "intro",
  states: {
    intro: {
      id: "intro",
      initial: "start",
      meta: { done: () => true },
      states: {
        [steps.introStart.relative]: {
          on: {
            SUBMIT: steps.forderungFragen.absolute,
          },
        },
      },
    },
    forderung: {
      id: "forderung",
      initial: "fragen",
      meta: { done: forderungDone },
      states: {
        [steps.forderungFragen.relative]: {
          on: {
            SUBMIT: [
              {
                guard: ({ context }) => context.forderung === "etwasAnderes",
                target: "ergebnis/forderung-etwas-anderes",
              },
              { guard: forderungDone, target: "#sachgebiet.info" },
            ],
            BACK: steps.introStart.absolute,
          },
        },
        "ergebnis/forderung-etwas-anderes": {
          on: {
            BACK: steps.forderungFragen.relative,
          },
        },
      },
    },
    sachgebiet: {
      id: "sachgebiet",
      initial: "info",
      meta: { done: () => false },
      states: {
        [steps.sachgebietInfo.relative]: {
          on: {
            SUBMIT: steps.sachgebietAusgeschlossen.relative,
            BACK: steps.forderungFragen.absolute,
          },
        },
        [steps.sachgebietAusgeschlossen.relative]: {
          on: {
            SUBMIT: [
              {
                guard: ({ context }) =>
                  context.sachgebietAusgeschlossen === "yes",
                target: "ergebnis/sachgebiet-abbruch",
              },
              {
                target: steps.sachgebietBesondere.relative,
              },
            ],
            BACK: steps.sachgebietInfo.relative,
          },
        },
        [steps.sachgebietBesondere.relative]: {
          on: {
            BACK: steps.sachgebietAusgeschlossen.relative,
          },
        },
        "ergebnis/sachgebiet-abbruch": {
          on: {
            BACK: steps.sachgebietAusgeschlossen.relative,
          },
        },
      },
    },
  },
} satisfies Config<GeldEinklagenFormularGerichtPruefenUserData>;
