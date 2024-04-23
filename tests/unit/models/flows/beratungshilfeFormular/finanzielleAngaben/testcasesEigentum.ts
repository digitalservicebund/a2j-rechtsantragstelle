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
      "finanzielleAngaben/wohnung/wohnsituation",
    ],
  ],
  [
    {
      hasBankkonto: "yes",
    },
    [
      "finanzielleAngaben/eigentum/bankkonten-frage",
      "finanzielleAngaben/eigentum/geldanlagen-frage",
      "finanzielleAngaben/eigentum/wertgegenstaende-frage",
      "finanzielleAngaben/eigentum/grundeigentum-frage",
      "finanzielleAngaben/eigentum/kraftfahrzeuge-frage",
      "finanzielleAngaben/wohnung/wohnsituation",
    ],
  ],
  [
    {
      hasGeldanlage: "yes",
    },
    [
      "finanzielleAngaben/eigentum/bankkonten-frage",
      "finanzielleAngaben/eigentum/geldanlagen-frage",
      "finanzielleAngaben/eigentum/wertgegenstaende-frage",
      "finanzielleAngaben/eigentum/grundeigentum-frage",
      "finanzielleAngaben/eigentum/kraftfahrzeuge-frage",
      "finanzielleAngaben/eigentum/gesamtwert",
      "finanzielleAngaben/wohnung/wohnsituation",
    ],
  ],
  [
    {
      hasBankkonto: "no",
      hasGeldanlage: "yes",
      hasWertsache: "no",
      hasKraftfahrzeug: "no",
      hasGrundeigentum: "no",
      eigentumTotalWorth: "more10000",
    },
    [
      "finanzielleAngaben/eigentum/bankkonten-frage",
      "finanzielleAngaben/eigentum/geldanlagen-frage",
      "finanzielleAngaben/eigentum/wertgegenstaende-frage",
      "finanzielleAngaben/eigentum/grundeigentum-frage",
      "finanzielleAngaben/eigentum/kraftfahrzeuge-frage",
      "finanzielleAngaben/eigentum/gesamtwert",
      "finanzielleAngaben/eigentum-zusammenfassung/zusammenfassung",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenEigentum = {
  machine,
  cases,
};
