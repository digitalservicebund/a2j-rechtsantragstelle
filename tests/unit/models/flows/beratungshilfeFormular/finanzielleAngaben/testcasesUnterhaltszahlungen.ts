import { machine } from "../testMachine";
import type { TestCases } from "../../TestCases";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const cases = [
  [
    { hasWeitereUnterhaltszahlungen: "no" },
    [
      "finanzielle-angaben/andere-unterhaltszahlungen/frage",
      "finanzielle-angaben/wohnung/wohnsituation",
    ],
  ],
  [
    { hasWeitereUnterhaltszahlungen: "yes" },
    [
      "finanzielle-angaben/andere-unterhaltszahlungen/frage",
      "finanzielle-angaben/andere-unterhaltszahlungen/uebersicht",
      "finanzielle-angaben/wohnung/wohnsituation",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenUnterhaltszahlungen =
  {
    machine,
    cases,
  };
