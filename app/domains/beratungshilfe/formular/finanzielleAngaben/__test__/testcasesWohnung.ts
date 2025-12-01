import { type FlowTestCases } from "~/domains/__test__/TestCases";
import { type BeratungshilfeFinanzielleAngabenWohnungUserData } from "~/domains/beratungshilfe/formular/finanzielleAngaben/wohnung/userData";

const finanzielleAngabenWohnungWohnsituation =
  "/finanzielle-angaben/wohnung/wohnsituation";
const finanzielleAngabenWohnungGroesse = "/finanzielle-angaben/wohnung/groesse";
const finanzielleAngabenEigentumEigentumInfo =
  "/finanzielle-angaben/eigentum/eigentum-info";

export const testCasesBeratungshilfeFormularFinanzielleAngabenWohnung = {
  livesAlone: [
    {
      stepId: finanzielleAngabenWohnungWohnsituation,
      userInput: {
        livingSituation: "alone",
      },
    },
    {
      stepId: finanzielleAngabenWohnungGroesse,
      userInput: { apartmentSizeSqm: 42 },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/wohnkosten-allein",
      userInput: { apartmentCostAlone: "1000" },
    },
    {
      stepId: finanzielleAngabenEigentumEigentumInfo,
    },
  ],
  livesWithRelatives: [
    {
      stepId: finanzielleAngabenWohnungWohnsituation,
      userInput: {
        livingSituation: "withRelatives",
      },
    },
    {
      stepId: finanzielleAngabenWohnungGroesse,
      userInput: { apartmentSizeSqm: 42 },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/personen-anzahl",
      userInput: { apartmentPersonCount: 2 },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/wohnkosten-geteilt",
      userInput: {
        apartmentCostOwnShare: "400",
        apartmentCostFull: "800",
      },
    },
    {
      stepId: finanzielleAngabenEigentumEigentumInfo,
    },
  ],
  livesWithOthers: [
    {
      stepId: finanzielleAngabenWohnungWohnsituation,
      userInput: {
        livingSituation: "withOthers",
      },
    },
    {
      stepId: finanzielleAngabenWohnungGroesse,
      userInput: { apartmentSizeSqm: 42 },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/personen-anzahl",
      userInput: { apartmentPersonCount: 2 },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/wohnkosten-geteilt",
      userInput: {
        apartmentCostOwnShare: "400",
        apartmentCostFull: "800",
      },
    },
    {
      stepId: finanzielleAngabenEigentumEigentumInfo,
    },
  ],
} satisfies FlowTestCases<BeratungshilfeFinanzielleAngabenWohnungUserData>;
