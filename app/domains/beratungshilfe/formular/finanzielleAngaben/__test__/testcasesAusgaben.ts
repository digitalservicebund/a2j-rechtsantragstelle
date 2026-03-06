import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type BeratungshilfeFinanzielleAngabenRegelmassigeAusgabenUserData } from "~/domains/beratungshilfe/formular/finanzielleAngaben/regelmaessigeAusgaben/userData";

const finanzielleAngabenAusgabenAusgabenFrage =
  "/finanzielle-angaben/ausgaben/ausgaben-frage";
const finanzielleAngabenAusgabenSituation =
  "/finanzielle-angaben/ausgaben/situation";

export const testCasesBeratungshilfeFormularFinanzielleAngabenAusgabe = {
  ausgabenNo: [
    {
      stepId: finanzielleAngabenAusgabenAusgabenFrage,
      userInput: { hasAusgaben: "no" },
    },
    { stepId: finanzielleAngabenAusgabenSituation },
  ],
  ausgabenYes: [
    {
      stepId: finanzielleAngabenAusgabenAusgabenFrage,
      userInput: { hasAusgaben: "yes" },
    },
    { stepId: "/finanzielle-angaben/ausgaben/uebersicht" },
    { stepId: "/finanzielle-angaben/ausgaben/warnung" },
    { stepId: finanzielleAngabenAusgabenSituation },
  ],
  ausgabeWithoutZahlungsfrist: [
    {
      stepId: finanzielleAngabenAusgabenAusgabenFrage,
      userInput: { hasAusgaben: "yes" },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/uebersicht",
      addArrayItemEvent: "add-ausgaben",
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/ausgaben/0/art",
      userInput: {
        "ausgaben#art": "test",
        "ausgaben#zahlungsempfaenger": "test",
      },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/ausgaben/0/zahlungsinformation",
      userInput: { "ausgaben#beitrag": "100" },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/ausgaben/0/laufzeit",
      userInput: { "ausgaben#hasZahlungsfrist": "no" },
    },
    { stepId: "/finanzielle-angaben/ausgaben/uebersicht" },
  ],
  ausgabeWithZahlungsfrist: [
    {
      stepId: finanzielleAngabenAusgabenAusgabenFrage,
      userInput: { hasAusgaben: "yes" },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/uebersicht",
      addArrayItemEvent: "add-ausgaben",
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/ausgaben/0/art",
      userInput: {
        "ausgaben#art": "test",
        "ausgaben#zahlungsempfaenger": "test",
      },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/ausgaben/0/zahlungsinformation",
      userInput: { "ausgaben#beitrag": "100" },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/ausgaben/0/laufzeit",
      userInput: {
        "ausgaben#hasZahlungsfrist": "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/ausgaben/0/zahlungsfrist",
      userInput: {
        "ausgaben#zahlungsfrist": { day: "01", month: "01", year: "2050" },
      },
    },
    { stepId: "/finanzielle-angaben/ausgaben/uebersicht" },
  ],
} satisfies FlowTestCases<BeratungshilfeFinanzielleAngabenRegelmassigeAusgabenUserData>;
