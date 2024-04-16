import { machine } from "../testMachine";
import type { TestCases } from "../../TestCases";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const cases = [
  [
    {},
    [
      "finanzielleAngaben/wohnung/wohnsituation",
      "finanzielleAngaben/wohnung/groesse",
      "finanzielleAngaben/ausgaben/ausgaben-frage",
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
      "finanzielleAngaben/ausgaben/ausgaben-frage",
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
      "finanzielleAngaben/ausgaben/ausgaben-frage",
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
      "finanzielleAngaben/ausgaben/ausgaben-frage",
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
      "finanzielleAngaben/ausgaben/ausgaben-frage",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenWohnung = {
  machine,
  cases,
};
