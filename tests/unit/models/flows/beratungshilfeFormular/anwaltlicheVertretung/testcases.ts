import { machine } from "../testMachine";
import type { TestCases } from "../../TestCases";
import type { BeratungshilfeAnwaltlicheVertretung } from "~/models/flows/beratungshilfeFormular/anwaltlicheVertretung/context";
import {
  sevenDaysAgoDate,
  thirtyDaysAgoDate,
} from "tests/unit/util/dateFormatting";

const cases = [
  [{}, ["anwaltlicheVertretung/start", "rechtsproblem/start"]],
  [
    { anwaltskanzlei: "no" },
    ["anwaltlicheVertretung/start", "rechtsproblem/start"],
  ],
  [
    { anwaltskanzlei: "yes" },
    [
      "anwaltlicheVertretung/start",
      "anwaltlicheVertretung/beratungStattgefunden",
      "rechtsproblem/start",
    ],
  ],
  [
    {
      anwaltskanzlei: "yes",
      beratungStattgefunden: "no",
    },
    [
      "anwaltlicheVertretung/start",
      "anwaltlicheVertretung/beratungStattgefunden",
      "rechtsproblem/start",
    ],
  ],
  [
    {
      anwaltskanzlei: "yes",
      beratungStattgefunden: "yes",
    },
    [
      "anwaltlicheVertretung/start",
      "anwaltlicheVertretung/beratungStattgefunden",
      "anwaltlicheVertretung/beratungStattgefundenDatum",
      "anwaltlicheVertretung/frist-hinweis",
      "anwaltlicheVertretung/anwaltKontaktdaten",
      "rechtsproblem/start",
    ],
  ],
  [
    {
      anwaltskanzlei: "yes",
      beratungStattgefunden: "yes",
      beratungStattgefundenDatum: sevenDaysAgoDate(),
    },
    [
      "anwaltlicheVertretung/start",
      "anwaltlicheVertretung/beratungStattgefunden",
      "anwaltlicheVertretung/beratungStattgefundenDatum",
      "anwaltlicheVertretung/frist-hinweis",
      "anwaltlicheVertretung/anwaltKontaktdaten",
      "rechtsproblem/start",
    ],
  ],
  [
    {
      anwaltskanzlei: "yes",
      beratungStattgefunden: "yes",
      beratungStattgefundenDatum: thirtyDaysAgoDate(),
    },
    [
      "anwaltlicheVertretung/start",
      "anwaltlicheVertretung/beratungStattgefunden",
      "anwaltlicheVertretung/beratungStattgefundenDatum",
      "anwaltlicheVertretung/anwalt-ende",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeAnwaltlicheVertretung>;

export const testCasesBeratungshilfeFormularAnwaltlicheVertretung = {
  machine,
  cases,
};
