import type { TestCases } from "~/domains/__test__/TestCases";
import { machine } from "~/domains/beratungshilfe/formular/__test__/testMachine";
import type { BeratungshilfeFinanzielleAngaben } from "~/domains/beratungshilfe/formular/finanzielleAngaben/context";

const finanzielleAngabenWohnungWohnsituation =
  "finanzielle-angaben/wohnung/wohnsituation";
const finanzielleAngabenWohnungGroesse = "finanzielle-angaben/wohnung/groesse";
const finanzielleAngabenEigentumEigentumInfo =
  "finanzielle-angaben/eigentum/eigentum-info";
const cases = [
  [
    {},
    [
      finanzielleAngabenWohnungWohnsituation,
      finanzielleAngabenWohnungGroesse,
      finanzielleAngabenEigentumEigentumInfo,
    ],
  ],
  [
    {
      livingSituation: "alone",
    },
    [
      finanzielleAngabenWohnungWohnsituation,
      finanzielleAngabenWohnungGroesse,
      "finanzielle-angaben/wohnung/wohnkosten-allein",
      finanzielleAngabenEigentumEigentumInfo,
    ],
  ],
  [
    {
      livingSituation: "alone",
      apartmentSizeSqm: 42,
      apartmentCostAlone: "800",
    },
    [
      finanzielleAngabenWohnungWohnsituation,
      finanzielleAngabenWohnungGroesse,
      "finanzielle-angaben/wohnung/wohnkosten-allein",
      finanzielleAngabenEigentumEigentumInfo,
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
      finanzielleAngabenWohnungWohnsituation,
      finanzielleAngabenWohnungGroesse,
      "finanzielle-angaben/wohnung/personen-anzahl",
      "finanzielle-angaben/wohnung/wohnkosten-geteilt",
      finanzielleAngabenEigentumEigentumInfo,
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
      finanzielleAngabenWohnungWohnsituation,
      finanzielleAngabenWohnungGroesse,
      "finanzielle-angaben/wohnung/personen-anzahl",
      "finanzielle-angaben/wohnung/wohnkosten-geteilt",
      finanzielleAngabenEigentumEigentumInfo,
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenWohnung = {
  machine,
  cases,
};
