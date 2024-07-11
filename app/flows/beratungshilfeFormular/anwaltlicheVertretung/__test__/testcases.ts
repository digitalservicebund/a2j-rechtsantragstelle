import type { TestCases } from "~/flows/__test__/TestCases";
import { machine } from "~/flows/beratungshilfeFormular/__test__/testMachine";
import type { BeratungshilfeAnwaltlicheVertretung } from "~/flows/beratungshilfeFormular/anwaltlicheVertretung/context";
import {
  sevenDaysAgoDate,
  thirtyDaysAgoDate,
} from "~/util/__test__/dateFormatting";

const rechtsproblemStart = "rechtsproblem/start";
const anwaltlicheVertretungStart = "anwaltliche-vertretung/start";
const anwaltlicheVertretungBeratungStattgefunden =
  "anwaltliche-vertretung/beratung-stattgefunden";
const anwaltlicheVertretungBeratungStattgefundenDatum =
  "anwaltliche-vertretung/beratung-stattgefunden-datum";
const cases = [
  [{}, [anwaltlicheVertretungStart, rechtsproblemStart]],
  [{ anwaltskanzlei: "no" }, [anwaltlicheVertretungStart, rechtsproblemStart]],
  [
    { anwaltskanzlei: "yes" },
    [
      anwaltlicheVertretungStart,
      anwaltlicheVertretungBeratungStattgefunden,
      rechtsproblemStart,
    ],
  ],
  [
    {
      anwaltskanzlei: "yes",
      beratungStattgefunden: "no",
    },
    [
      anwaltlicheVertretungStart,
      anwaltlicheVertretungBeratungStattgefunden,
      rechtsproblemStart,
    ],
  ],
  [
    {
      anwaltskanzlei: "yes",
      beratungStattgefunden: "yes",
    },
    [
      anwaltlicheVertretungStart,
      anwaltlicheVertretungBeratungStattgefunden,
      anwaltlicheVertretungBeratungStattgefundenDatum,
      "anwaltliche-vertretung/frist-hinweis",
      "anwaltliche-vertretung/anwalt-kontaktdaten",
      rechtsproblemStart,
    ],
  ],
  [
    {
      anwaltskanzlei: "yes",
      beratungStattgefunden: "yes",
      beratungStattgefundenDatum: sevenDaysAgoDate(),
    },
    [
      anwaltlicheVertretungStart,
      anwaltlicheVertretungBeratungStattgefunden,
      anwaltlicheVertretungBeratungStattgefundenDatum,
      "anwaltliche-vertretung/frist-hinweis",
      "anwaltliche-vertretung/anwalt-kontaktdaten",
      rechtsproblemStart,
    ],
  ],
  [
    {
      anwaltskanzlei: "yes",
      beratungStattgefunden: "yes",
      beratungStattgefundenDatum: thirtyDaysAgoDate(),
    },
    [
      anwaltlicheVertretungStart,
      anwaltlicheVertretungBeratungStattgefunden,
      anwaltlicheVertretungBeratungStattgefundenDatum,
      "anwaltliche-vertretung/anwalt-ende",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeAnwaltlicheVertretung>;

export const testCasesBeratungshilfeFormularAnwaltlicheVertretung = {
  machine,
  cases,
};
