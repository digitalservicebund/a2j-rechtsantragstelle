import mapValues from "lodash/mapValues";
import type { Config } from "~/services/flow/server/buildFlowController";
import { rechtsproblemDone } from "./rechtsproblemDone";
import { beratungshilfeAnwaltlicheVertretungGuards } from "../anwaltlicheVertretung/guards";
import { type BeratungshilfeAnwaltlicheVertretungUserData } from "../anwaltlicheVertretung/userData";
import { beratungshilfeAntragPages } from "../pages";

const stepIds = mapValues(beratungshilfeAntragPages, (v) => v.stepId);

export const rechtsproblemXstateConfig = {
  initial: stepIds.rechtsproblemStart,
  id: stepIds.rechtsproblem,
  meta: { done: rechtsproblemDone },
  states: {
    [stepIds.rechtsproblemStart]: {
      on: {
        SUBMIT: stepIds.bereich,
        BACK: [
          {
            guard:
              beratungshilfeAnwaltlicheVertretungGuards.beratungStattgefundenYes,
            target: stepIds.anwaltKontakdaten,
          },
          {
            guard: beratungshilfeAnwaltlicheVertretungGuards.anwaltskanzleiYes,
            target: stepIds.beratungStattgefunden,
          },
          {
            target: stepIds.anwaltlicheVertretungStart,
          },
        ],
      },
    },
    [stepIds.bereich]: {
      on: {
        SUBMIT: stepIds.situationBeschreibung,
        BACK: stepIds.rechtsproblemStart,
      },
    },
    [stepIds.situationBeschreibung]: {
      on: {
        SUBMIT: stepIds.finanzielleAngaben,
        BACK: stepIds.bereich,
      },
    },
  },
} satisfies Config<BeratungshilfeAnwaltlicheVertretungUserData>;
