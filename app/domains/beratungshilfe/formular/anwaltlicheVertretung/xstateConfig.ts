import type { Config } from "~/services/flow/server/buildFlowController";
import type { BeratungshilfeAnwaltlicheVertretung } from "./context";
import {
  anwaltlicheVertretungDone,
  beratungshilfeAnwaltlicheVertretungGuards,
} from "./guards";

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
            target: "beratung-stattgefunden",
          },
          {
            target: "#rechtsproblem.start",
          },
        ],
        BACK: "#grundvoraussetzungen.eigeninitiative-grundvorraussetzung",
      },
    },
    "beratung-stattgefunden": {
      on: {
        SUBMIT: [
          {
            guard:
              beratungshilfeAnwaltlicheVertretungGuards.beratungStattgefundenYes,
            target: "beratung-stattgefunden-datum",
          },
          {
            target: "#rechtsproblem.start",
          },
        ],
        BACK: "start",
      },
    },
    "beratung-stattgefunden-datum": {
      on: {
        SUBMIT: [
          {
            guard:
              beratungshilfeAnwaltlicheVertretungGuards.beratungStattgefundenDatumLaterThanFourWeeks,
            target: "anwalt-ende",
          },
          {
            target: "frist-hinweis",
          },
        ],
        BACK: "beratung-stattgefunden",
      },
    },
    "frist-hinweis": {
      on: {
        SUBMIT: "anwalt-kontaktdaten",
        BACK: "beratung-stattgefunden-datum",
      },
    },
    "anwalt-kontaktdaten": {
      on: {
        SUBMIT: "#rechtsproblem.start",
        BACK: "frist-hinweis",
      },
    },
    "anwalt-ende": {
      on: {
        BACK: "beratung-stattgefunden-datum",
      },
    },
  },
} satisfies Config<BeratungshilfeAnwaltlicheVertretung>;
