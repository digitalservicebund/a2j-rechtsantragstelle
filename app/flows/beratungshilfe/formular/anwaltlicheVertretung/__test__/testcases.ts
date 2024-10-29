import type { TestCases } from "~/flows/__test__/TestCases";
import { machine } from "~/flows/beratungshilfe/formular/__test__/testMachine";
import type { BeratungshilfeAnwaltlicheVertretung } from "~/flows/beratungshilfe/formular/anwaltlicheVertretung/context";
import { addDays, today, toGermanDateFormat } from "~/util/date";

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
      beratungStattgefundenDatum: toGermanDateFormat(addDays(today(), -7)),
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
      beratungStattgefundenDatum: toGermanDateFormat(addDays(today(), -30)),
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
