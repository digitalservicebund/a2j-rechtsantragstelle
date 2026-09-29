import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular/userData";
import { reachAnwaltlicheVertretung } from "~/domains/beratungshilfe/formular/__test__/reachData";
import { addDays, today, toGermanDateString } from "~/util/date";

const rechtsproblemStart = "/rechtsproblem/start";
const anwaltlicheVertretungStart = "/anwaltliche-vertretung/start";
const anwaltlicheVertretungBeratungStattgefunden =
  "/anwaltliche-vertretung/beratung-stattgefunden";
const anwaltlicheVertretungBeratungStattgefundenDatum =
  "/anwaltliche-vertretung/beratung-stattgefunden-datum";

export const testCasesBeratungshilfeFormularAnwaltlicheVertretung = {
  noAnwaltlicheVertretung: [
    {
      stepId: anwaltlicheVertretungStart,
      userInput: { ...reachAnwaltlicheVertretung, anwaltskanzlei: "no" },
    },
    { stepId: rechtsproblemStart },
  ],
  anwaltlicheVertretungYes: [
    {
      stepId: anwaltlicheVertretungStart,
      userInput: { ...reachAnwaltlicheVertretung, anwaltskanzlei: "yes" },
    },
    { stepId: anwaltlicheVertretungBeratungStattgefunden },
  ],
  beratungStattgefundenNo: [
    {
      stepId: anwaltlicheVertretungStart,
      userInput: { ...reachAnwaltlicheVertretung, anwaltskanzlei: "yes" },
    },
    {
      stepId: anwaltlicheVertretungBeratungStattgefunden,
      userInput: {
        beratungStattgefunden: "no",
      },
    },
    { stepId: rechtsproblemStart },
  ],
  beratungStattgefundenYes: [
    {
      stepId: anwaltlicheVertretungStart,
      userInput: { ...reachAnwaltlicheVertretung, anwaltskanzlei: "yes" },
    },
    {
      stepId: anwaltlicheVertretungBeratungStattgefunden,
      userInput: {
        beratungStattgefunden: "yes",
      },
    },
    { stepId: anwaltlicheVertretungBeratungStattgefundenDatum },
  ],
  beratungOccurredWeekAgo: [
    {
      stepId: anwaltlicheVertretungStart,
      userInput: { ...reachAnwaltlicheVertretung, anwaltskanzlei: "yes" },
    },
    {
      stepId: anwaltlicheVertretungBeratungStattgefunden,
      userInput: {
        beratungStattgefunden: "yes",
      },
    },
    {
      stepId: anwaltlicheVertretungBeratungStattgefundenDatum,
      userInput: {
        beratungStattgefundenDatum: toGermanDateString(addDays(today(), -7)),
      },
    },
    { stepId: "/anwaltliche-vertretung/frist-hinweis" },
    {
      stepId: "/anwaltliche-vertretung/anwalt-kontaktdaten",
      userInput: {
        anwaltName: "Max Mustermann",
        anwaltStrasseUndHausnummer: "Musterstraße 1",
        anwaltPlz: "12437",
        anwaltOrt: "Musterstadt",
      },
    },
    { stepId: rechtsproblemStart },
  ],
  beratungOccurredMonthAgo: [
    {
      stepId: anwaltlicheVertretungStart,
      userInput: { ...reachAnwaltlicheVertretung, anwaltskanzlei: "yes" },
    },
    {
      stepId: anwaltlicheVertretungBeratungStattgefunden,
      userInput: {
        beratungStattgefunden: "yes",
      },
    },
    {
      stepId: anwaltlicheVertretungBeratungStattgefundenDatum,
      userInput: {
        beratungStattgefundenDatum: toGermanDateString(addDays(today(), -30)),
      },
    },
    { stepId: "/anwaltliche-vertretung/anwalt-ende" },
  ],
} satisfies FlowTestCases<BeratungshilfeFormularUserData>;
