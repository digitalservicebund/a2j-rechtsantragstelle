import mapValues from "lodash/mapValues";
import type { Config } from "~/services/flow/server/buildFlowController";
import {
  anwaltlicheVertretungDone,
  beratungshilfeAnwaltlicheVertretungGuards,
} from "./guards";
import { berHAntragAnwaltlicheVertretungPages } from "./pages";
import type { BeratungshilfeAnwaltlicheVertretungUserData } from "./userData";

const steps = mapValues(berHAntragAnwaltlicheVertretungPages, (v) => ({
  absolute: "#" + v.stepId.replaceAll("/", "."),
  relative: v.stepId.split("/").pop()!,
}));

export const anwaltlicheVertretungXstateConfig = {
  initial: "start",
  id: "anwaltliche-vertretung",
  meta: { done: anwaltlicheVertretungDone },
  states: {
    start: {
      on: {
        SUBMIT: [
          {
            guard: beratungshilfeAnwaltlicheVertretungGuards.anwaltskanzleiYes,
            target: steps.beratungStattgefunden.relative,
          },
          {
            target: "#rechtsproblem.start",
          },
        ],
        BACK: "#grundvoraussetzungen.eigeninitiative-grundvorraussetzung",
      },
    },
    [steps.beratungStattgefunden.relative]: {
      on: {
        SUBMIT: [
          {
            guard:
              beratungshilfeAnwaltlicheVertretungGuards.beratungStattgefundenYes,
            target: steps.beratungStattgefundenDatum.relative,
          },
          {
            target: "#rechtsproblem.start",
          },
        ],
        BACK: "start",
      },
    },
    [steps.beratungStattgefundenDatum.relative]: {
      on: {
        SUBMIT: [
          {
            guard:
              beratungshilfeAnwaltlicheVertretungGuards.beratungStattgefundenDatumLaterThanFourWeeks,
            target: steps.anwaltEnde.relative,
          },
          {
            target: steps.fristHinweis.relative,
          },
        ],
        BACK: steps.beratungStattgefunden.relative,
      },
    },
    [steps.fristHinweis.relative]: {
      on: {
        SUBMIT: steps.anwaltKontaktdaten.relative,
        BACK: steps.beratungStattgefundenDatum.relative,
      },
    },
    [steps.anwaltKontaktdaten.relative]: {
      on: {
        SUBMIT: "#rechtsproblem.start",
        BACK: steps.fristHinweis.relative,
      },
    },
    [steps.anwaltEnde.relative]: {
      on: {
        BACK: steps.beratungStattgefundenDatum.relative,
      },
    },
  },
} satisfies Config<BeratungshilfeAnwaltlicheVertretungUserData>;
