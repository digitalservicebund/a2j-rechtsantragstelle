import type { FlowTestCases } from "~/domains/__test__/TestCases";

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
      addArrayItemStep: "add-ausgaben",
      userInput: {
        ausgaben: [],
        pageData: { arrayIndexes: [0] },
      },
    },
    // Inserted array indices are needed to correctly access the nested pageData
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
      addArrayItemStep: "add-ausgaben",
      userInput: {
        ausgaben: [],
        pageData: { arrayIndexes: [0] },
      },
    },
    // Inserted array indices are needed to correctly access the nested pageData
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
        ausgaben: [
          {
            hasZahlungsfrist: "yes",
          },
        ],
        pageData: { arrayIndexes: [0] },
      },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/ausgaben/0/zahlungsfrist",
      userInput: { "ausgaben#zahlungsfrist": "01.01.2050" },
    },
    { stepId: "/finanzielle-angaben/ausgaben/uebersicht" },
  ],
} satisfies FlowTestCases["testcases"];
