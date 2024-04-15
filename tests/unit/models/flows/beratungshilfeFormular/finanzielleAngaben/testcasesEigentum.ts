import { machine } from "../testMachine";
import type { TestCases } from "../../TestCases";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const cases = [
  [
    {},
    [
      "finanzielleAngaben/eigentum/bankkonten-frage",
      "finanzielleAngaben/eigentum/geldanlagen-frage",
      "finanzielleAngaben/eigentum/wertgegenstaende-frage",
      "finanzielleAngaben/eigentum/grundeigentum-frage",
      "finanzielleAngaben/eigentum/kraftfahrzeuge-frage",
      "finanzielleAngaben/eigentum/gesamtwert",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenEigentum = {
  machine,
  cases,
};
