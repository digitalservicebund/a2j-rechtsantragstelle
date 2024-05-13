import { machine } from "~/models/flows/beratungshilfeFormular/__test__/testMachine";
import type { TestCases } from "~/models/flows/__test__/TestCases";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const cases = [
  [
    {},
    [
      "finanzielle-angaben/wohnung/wohnsituation",
      "finanzielle-angaben/wohnung/groesse",
      "finanzielle-angaben/eigentum/eigentum-info",
    ],
  ],
  [
    {
      livingSituation: "alone",
    },
    [
      "finanzielle-angaben/wohnung/wohnsituation",
      "finanzielle-angaben/wohnung/groesse",
      "finanzielle-angaben/wohnung/wohnkosten-allein",
      "finanzielle-angaben/eigentum/eigentum-info",
    ],
  ],
  [
    {
      livingSituation: "alone",
      apartmentSizeSqm: 42,
      apartmentCostAlone: "800",
    },
    [
      "finanzielle-angaben/wohnung/wohnsituation",
      "finanzielle-angaben/wohnung/groesse",
      "finanzielle-angaben/wohnung/wohnkosten-allein",
      "finanzielle-angaben/eigentum/eigentum-info",
    ],
  ],
  [
    {
      livingSituation: "withRelatives",
      apartmentSizeSqm: 42,
      apartmentCostOwnShare: "400",
      apartmentCostFull: "800",
    },
    [
      "finanzielle-angaben/wohnung/wohnsituation",
      "finanzielle-angaben/wohnung/groesse",
      "finanzielle-angaben/wohnung/personen-anzahl",
      "finanzielle-angaben/wohnung/wohnkosten-geteilt",
      "finanzielle-angaben/eigentum/eigentum-info",
    ],
  ],
  [
    {
      livingSituation: "withOthers",
      apartmentSizeSqm: 42,
      apartmentCostOwnShare: "400",
      apartmentCostFull: "800",
    },
    [
      "finanzielle-angaben/wohnung/wohnsituation",
      "finanzielle-angaben/wohnung/groesse",
      "finanzielle-angaben/wohnung/personen-anzahl",
      "finanzielle-angaben/wohnung/wohnkosten-geteilt",
      "finanzielle-angaben/eigentum/eigentum-info",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenWohnung = {
  machine,
  cases,
};
