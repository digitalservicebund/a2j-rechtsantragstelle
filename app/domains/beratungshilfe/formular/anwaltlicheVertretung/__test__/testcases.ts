import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type BeratungshilfeAnwaltlicheVertretungUserData } from "~/domains/beratungshilfe/formular/anwaltlicheVertretung/userData";
import { addDays, today } from "~/util/date";

const rechtsproblemStart = "/rechtsproblem/start";
const anwaltlicheVertretungStart = "/anwaltliche-vertretung/start";
const anwaltlicheVertretungBeratungStattgefunden =
  "/anwaltliche-vertretung/beratung-stattgefunden";
const anwaltlicheVertretungBeratungStattgefundenDatum =
  "/anwaltliche-vertretung/beratung-stattgefunden-datum";

const formatDate = (
  date: Date,
): { day: string; month: string; year: string } => ({
  day: String(date.getDate()).padStart(2, "0"),
  month: String(date.getMonth() + 1).padStart(2, "0"),
  year: String(date.getFullYear()),
});

export const testCasesBeratungshilfeFormularAnwaltlicheVertretung = {
  noAnwaltlicheVertretung: [
    { stepId: anwaltlicheVertretungStart, userInput: { anwaltskanzlei: "no" } },
    { stepId: rechtsproblemStart },
  ],
  anwaltlicheVertretungYes: [
    {
      stepId: anwaltlicheVertretungStart,
      userInput: { anwaltskanzlei: "yes" },
    },
    { stepId: anwaltlicheVertretungBeratungStattgefunden },
  ],
  beratungStattgefundenNo: [
    {
      stepId: anwaltlicheVertretungStart,
      userInput: { anwaltskanzlei: "yes" },
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
      userInput: { anwaltskanzlei: "yes" },
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
      userInput: { anwaltskanzlei: "yes" },
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
        beratungStattgefundenDatum: formatDate(addDays(today(), -7)),
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
      userInput: { anwaltskanzlei: "yes" },
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
        beratungStattgefundenDatum: formatDate(addDays(today(), -30)),
      },
    },
    { stepId: "/anwaltliche-vertretung/anwalt-ende" },
  ],
} satisfies FlowTestCases<BeratungshilfeAnwaltlicheVertretungUserData>;
