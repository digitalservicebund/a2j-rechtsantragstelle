import { machine } from "../testMachine";
import type { TestCases } from "../../TestCases";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const cases = [
  [
    { hasOtherMaintenancePayments: "no" },
    [
      "finanzielleAngaben/andere-unterhaltszahlungen/frage",
      "finanzielleAngaben/besitz/eigentum-info",
    ],
  ],
  [
    { hasOtherMaintenancePayments: "yes" },
    [
      "finanzielleAngaben/andere-unterhaltszahlungen/frage",
      "finanzielleAngaben/andere-unterhaltszahlungen/uebersicht",
      "finanzielleAngaben/besitz/eigentum-info",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenUnterhaltszahlungen =
  {
    machine,
    cases,
  };
