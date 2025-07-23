import mapValues from "lodash/mapValues";
import type { Config } from "~/services/flow/server/buildFlowController";
import {
  anwaltlicheVertretungDone,
  beratungshilfeAnwaltlicheVertretungGuards,
} from "./guards";
import type { BeratungshilfeAnwaltlicheVertretungUserData } from "./userData";
import { beratungshilfeAntragPages } from "../pages";

const stepIds = mapValues(beratungshilfeAntragPages, (v) => v.stepId);

export const anwaltlicheVertretungXstateConfig = {
  initial: stepIds.start,
  id: stepIds.anwaltlicheVertretung,
  meta: { done: anwaltlicheVertretungDone },
  states: {
    [stepIds.start]: {
      on: {
        SUBMIT: [
          {
            guard: beratungshilfeAnwaltlicheVertretungGuards.anwaltskanzleiYes,
            target: stepIds.beratungStattgefunden,
          },
          {
            target: stepIds.rechtsproblemStart,
          },
        ],
        BACK: stepIds.eigeninitiativeGrundvorraussetzung,
      },
    },
    [stepIds.beratungStattgefunden]: {
      on: {
        SUBMIT: [
          {
            guard:
              beratungshilfeAnwaltlicheVertretungGuards.beratungStattgefundenYes,
            target: stepIds.beratungStattgefundenDatum,
          },
          {
            target: stepIds.rechtsproblemStart,
          },
        ],
        BACK: "start",
      },
    },
    [stepIds.beratungStattgefundenDatum]: {
      on: {
        SUBMIT: [
          {
            guard:
              beratungshilfeAnwaltlicheVertretungGuards.beratungStattgefundenDatumLaterThanFourWeeks,
            target: stepIds.anwaltEnde,
          },
          {
            target: stepIds.fristHinweis,
          },
        ],
        BACK: stepIds.beratungStattgefunden,
      },
    },
    [stepIds.fristHinweis]: {
      on: {
        SUBMIT: stepIds.anwaltKontakdaten,
        BACK: stepIds.beratungStattgefundenDatum,
      },
    },
    [stepIds.anwaltKontakdaten]: {
      on: {
        SUBMIT: stepIds.rechtsproblemStart,
        BACK: stepIds.fristHinweis,
      },
    },
    [stepIds.anwaltEnde]: {
      on: {
        BACK: stepIds.beratungStattgefundenDatum,
      },
    },
  },
} satisfies Config<BeratungshilfeAnwaltlicheVertretungUserData>;
