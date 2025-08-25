import mapValues from "lodash/mapValues";
import type { Config } from "~/services/flow/server/types";
import { berHAntragRechtsproblemPages } from "./pages";
import { rechtsproblemDone } from "./rechtsproblemDone";
import { beratungshilfeAnwaltlicheVertretungGuards } from "../anwaltlicheVertretung/guards";
import { type BeratungshilfeAnwaltlicheVertretungUserData } from "../anwaltlicheVertretung/userData";

const steps = mapValues(berHAntragRechtsproblemPages, (v) => ({
  absolute: "#" + v.stepId.replaceAll("/", "."),
  relative: v.stepId.split("/").pop()!,
}));

export const rechtsproblemXstateConfig = {
  initial: "start",
  id: "rechtsproblem",
  meta: { done: rechtsproblemDone },
  states: {
    start: {
      on: {
        SUBMIT: steps.bereich.relative,
        BACK: [
          {
            guard:
              beratungshilfeAnwaltlicheVertretungGuards.beratungStattgefundenYes,
            target: "#anwaltliche-vertretung.anwalt-kontaktdaten",
          },
          {
            guard: beratungshilfeAnwaltlicheVertretungGuards.anwaltskanzleiYes,
            target: "#anwaltliche-vertretung.beratung-stattgefunden",
          },
          {
            target: "#anwaltliche-vertretung.start",
          },
        ],
      },
    },
    [steps.bereich.relative]: {
      on: {
        SUBMIT: steps.situationBeschreibung.relative,
        BACK: "start",
      },
    },
    [steps.situationBeschreibung.relative]: {
      on: {
        SUBMIT: "#finanzielle-angaben",
        BACK: steps.bereich.relative,
      },
    },
  },
} satisfies Config<BeratungshilfeAnwaltlicheVertretungUserData>;
