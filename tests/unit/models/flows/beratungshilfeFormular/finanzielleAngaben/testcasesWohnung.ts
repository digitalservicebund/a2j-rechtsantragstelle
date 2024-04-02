import { machine } from "../testMachine";
import type { TestCases } from "../../TestCases";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const cases = [
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
      "persoenlicheDaten/start",
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
      "persoenlicheDaten/start",
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
      "persoenlicheDaten/start",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenWohnung = {
  machine,
  cases,
};
