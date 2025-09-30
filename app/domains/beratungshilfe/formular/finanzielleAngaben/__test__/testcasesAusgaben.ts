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
    // {
    //   stepId: "/finanzielle-angaben/ausgaben/ausgaben/art",
    //   userInput: { art: "test", zahlungsempfaenger: "test" },
    // },
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
  // [
  //   {
  //     hasAusgaben: "yes",
  //     ausgaben: [
  //       {
  //         art: "kredit",
  //         zahlungsempfaenger: "nachname",
  //         beitrag: "10",
  //         hasZahlungsfrist: "yes",
  //         zahlungsfrist: "",
  //       },
  //     ],
  //     pageData: { arrayIndexes: [0] },
  //   },
  //   [
  //     "/finanzielle-angaben/ausgaben/ausgaben/zahlungsinformation",
  //     "/finanzielle-angaben/ausgaben/ausgaben/laufzeit",
  //     "/finanzielle-angaben/ausgaben/ausgaben/zahlungsfrist",
  //   ],
  // ],
} satisfies FlowTestCases["testcases"];
