import type { Config } from "~/services/flow/server/buildFlowController";
import { rechtsproblemDone } from "./rechtsproblemDone";
import { beratungshilfeAnwaltlicheVertretungGuards } from "../anwaltlicheVertretung/guards";
import { type BeratungshilfeAnwaltlicheVertretungUserData } from "../anwaltlicheVertretung/userData";

export const rechtsproblemXstateConfig = {
  initial: "start",
  id: "rechtsproblem",
  meta: { done: rechtsproblemDone },
  states: {
    start: {
      on: {
        SUBMIT: "bereich",
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
    bereich: {
      on: {
        SUBMIT: "situation-beschreibung",
        BACK: "start",
      },
    },
    "situation-beschreibung": {
      on: {
        SUBMIT: "#finanzielle-angaben",
        BACK: "bereich",
      },
    },
  },
} satisfies Config<BeratungshilfeAnwaltlicheVertretungUserData>;
