import { machine } from "../testMachine";
import type { TestCases } from "../../TestCases";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const cases = [
  [
    { hasWeitereUnterhaltszahlungen: "no" },
    [
      "finanzielleAngaben/andere-unterhaltszahlungen/frage",
      "finanzielleAngaben/wohnung/wohnsituation",
    ],
  ],
  [
    { hasWeitereUnterhaltszahlungen: "yes" },
    [
      "finanzielleAngaben/andere-unterhaltszahlungen/frage",
      "finanzielleAngaben/andere-unterhaltszahlungen/uebersicht",
      "finanzielleAngaben/wohnung/wohnsituation",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenUnterhaltszahlungen =
  {
    machine,
    cases,
  };
