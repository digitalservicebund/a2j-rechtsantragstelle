import type { Config } from "~/services/flow/server/buildFlowController";
import { rechtsproblemDone } from "./context";
import type { BeratungshilfeAnwaltlicheVertretung } from "../anwaltlicheVertretung/context";
import { beratungshilfeAnwaltlicheVertretungGuards } from "../anwaltlicheVertretung/guards";

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
} satisfies Config<BeratungshilfeAnwaltlicheVertretung>;
