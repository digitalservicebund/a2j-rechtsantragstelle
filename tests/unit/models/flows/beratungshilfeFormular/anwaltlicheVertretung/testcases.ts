import { machine } from "../testMachine";
import type { TestCases } from "../../TestCases";
import type { BeratungshilfeAnwaltlicheVertretung } from "~/models/flows/beratungshilfeFormular/anwaltlicheVertretung/context";
import {
  sevenDaysAgoDate,
  thirtyDaysAgoDate,
} from "tests/unit/util/dateFormatting";

const cases = [
  [{}, ["anwaltliche-vertretung/start", "rechtsproblem/start"]],
  [
    { anwaltskanzlei: "no" },
    ["anwaltliche-vertretung/start", "rechtsproblem/start"],
  ],
  [
    { anwaltskanzlei: "yes" },
    [
      "anwaltliche-vertretung/start",
      "anwaltliche-vertretung/beratung-stattgefunden",
      "rechtsproblem/start",
    ],
  ],
  [
    {
      anwaltskanzlei: "yes",
      beratungStattgefunden: "no",
    },
    [
      "anwaltliche-vertretung/start",
      "anwaltliche-vertretung/beratung-stattgefunden",
      "rechtsproblem/start",
    ],
  ],
  [
    {
      anwaltskanzlei: "yes",
      beratungStattgefunden: "yes",
    },
    [
      "anwaltliche-vertretung/start",
      "anwaltliche-vertretung/beratung-stattgefunden",
      "anwaltliche-vertretung/beratung-stattgefunden-datum",
      "anwaltliche-vertretung/frist-hinweis",
      "anwaltliche-vertretung/anwalt-kontaktdaten",
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
      "anwaltliche-vertretung/start",
      "anwaltliche-vertretung/beratung-stattgefunden",
      "anwaltliche-vertretung/beratung-stattgefunden-datum",
      "anwaltliche-vertretung/frist-hinweis",
      "anwaltliche-vertretung/anwalt-kontaktdaten",
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
      "anwaltliche-vertretung/start",
      "anwaltliche-vertretung/beratung-stattgefunden",
      "anwaltliche-vertretung/beratung-stattgefunden-datum",
      "anwaltliche-vertretung/anwalt-ende",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeAnwaltlicheVertretung>;

export const testCasesBeratungshilfeFormularAnwaltlicheVertretung = {
  machine,
  cases,
};
