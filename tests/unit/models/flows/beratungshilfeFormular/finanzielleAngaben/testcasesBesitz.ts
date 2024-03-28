import { machine } from "../testMachine";
import type { TestCases } from "../../TestCases";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const cases = [
  [
    {},
    [
      "finanzielleAngaben/besitz/bankkonten-frage",
      "finanzielleAngaben/besitz/geldanlagen-frage",
      "finanzielleAngaben/besitz/wertgegenstaende-frage",
      "finanzielleAngaben/besitz/grundeigentum-frage",
      "finanzielleAngaben/besitz/kraftfahrzeuge-frage",
      "finanzielleAngaben/besitz/gesamtwert",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenBesitz = {
  machine,
  cases,
};
