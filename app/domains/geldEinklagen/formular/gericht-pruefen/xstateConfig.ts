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
            SUBMIT: "#forderung.fragen",
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
    sachgebiet: {
      id: "sachgebiet",
      initial: "info",
      meta: { done: () => false },
      states: {
        [steps.sachgebietInfo.relative]: {
          on: {
            SUBMIT: "ausgeschlossen",
            BACK: "#forderung.fragen",
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
                target: "besondere",
              },
            ],
            BACK: "#sachgebiet.info",
          },
        },
        besondere: {
          on: {
            BACK: "#sachgebiet.ausgeschlossen",
          },
        },
        "ergebnis/sachgebiet-abbruch": {
          on: {
            BACK: "#forderung.fragen",
          },
        },
      },
    },
  },
} satisfies Config<GeldEinklagenFormularGerichtPruefenUserData>;
