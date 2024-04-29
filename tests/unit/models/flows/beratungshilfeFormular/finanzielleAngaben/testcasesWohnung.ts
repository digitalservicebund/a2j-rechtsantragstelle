import { machine } from "../testMachine";
import type { TestCases } from "../../TestCases";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const cases = [
  [
    {},
    [
      "finanzielleAngaben/wohnung/wohnsituation",
      "finanzielleAngaben/wohnung/groesse",
      "finanzielleAngaben/eigentum/eigentum-info",
    ],
  ],
  [
    {
      livingSituation: "alone",
    },
    [
      "finanzielleAngaben/wohnung/wohnsituation",
      "finanzielleAngaben/wohnung/groesse",
      "finanzielleAngaben/wohnung/wohnkostenAllein",
      "finanzielleAngaben/eigentum/eigentum-info",
    ],
  ],
  [
    {
      livingSituation: "alone",
      apartmentSizeSqm: 42,
      apartmentCostAlone: "800",
    },
    [
      "finanzielleAngaben/wohnung/wohnsituation",
      "finanzielleAngaben/wohnung/groesse",
      "finanzielleAngaben/wohnung/wohnkostenAllein",
      "finanzielleAngaben/eigentum/eigentum-info",
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
      "finanzielleAngaben/wohnung/wohnsituation",
      "finanzielleAngaben/wohnung/groesse",
      "finanzielleAngaben/wohnung/personenAnzahl",
      "finanzielleAngaben/wohnung/wohnkostenGeteilt",
      "finanzielleAngaben/eigentum/eigentum-info",
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
      "finanzielleAngaben/wohnung/wohnsituation",
      "finanzielleAngaben/wohnung/groesse",
      "finanzielleAngaben/wohnung/personenAnzahl",
      "finanzielleAngaben/wohnung/wohnkostenGeteilt",
      "finanzielleAngaben/eigentum/eigentum-info",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenWohnung = {
  machine,
  cases,
};
